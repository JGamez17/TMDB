/**
 * @jest-environment node
 */
import { GET } from "./route"
import { NextResponse } from "next/server"

// Extend global fetch mock type
declare global {
    var fetch: jest.Mock
}

// Mock NextResponse
jest.mock("next/server", () => ({
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            ok: !init?.status || (init.status >= 200 && init.status < 300),
            status: init?.status || 200,
        })),
    },
}))

describe("Trending Movies API", () => {
    const mockMovieData = {
        page: 1,
        results: [
            {
                id: 123,
                title: "Test Movie",
                poster_path: "/test-poster.jpg",
                backdrop_path: "/test-backdrop.jpg",
                overview: "A test movie overview",
                release_date: "2024-01-01",
                vote_average: 8.5,
                vote_count: 1000,
                popularity: 100.5,
                adult: false,
                genre_ids: [28, 12],
                original_language: "en",
                original_title: "Test Movie",
                video: false,
            },
            {
                id: 456,
                title: "Another Test Movie",
                poster_path: "/another-poster.jpg",
                backdrop_path: "/another-backdrop.jpg",
                overview: "Another test movie overview",
                release_date: "2024-02-01",
                vote_average: 7.8,
                vote_count: 500,
                popularity: 85.3,
                adult: false,
                genre_ids: [18, 10749],
                original_language: "en",
                original_title: "Another Test Movie",
                video: false,
            },
        ],
        total_pages: 100,
        total_results: 2000,
    }

    let originalFetch: typeof global.fetch
    let originalEnv: NodeJS.ProcessEnv

    beforeEach(() => {
        // Store original fetch and env
        originalFetch = global.fetch
        originalEnv = process.env

        // Set up test environment
        process.env = {
            ...originalEnv,
            TMDB_API_KEY: "test-api-key-123",
        }

        // Clear all mocks
        jest.clearAllMocks()
    })

    afterEach(() => {
        // Restore original fetch and env
        global.fetch = originalFetch
        process.env = originalEnv
    })

    it("should return trending movies when the TMDB API call is successful", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockMovieData,
        } as Response)

        const request = new Request("http://localhost:3000/api/trending?timeWindow=week")

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)

        expect(data).toEqual(mockMovieData)
        expect(data.results).toHaveLength(2)
        expect(data.results[0]).toHaveProperty("id")
        expect(data.results[0]).toHaveProperty("title")
        expect(data.results[0]).toHaveProperty("poster_path")

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("https://api.themoviedb.org/3/trending/movie/week"),
            expect.any(Object),
        )
    })

    it("should return a 500 error when the TMDB API fails", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal Server Error" }),
        } as Response)

        const request = new Request("http://localhost:3000/api/trending?timeWindow=day")

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(500)

        expect(data).toHaveProperty("error")
        expect(data.error).toBe("Failed to fetch trending movies")

        expect(global.fetch).toHaveBeenCalled()
    })

    it("should return movies with expected data structure", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockMovieData,
        } as Response)

        const request = new Request("http://localhost:3000/api/trending")

        const response = await GET(request)
        const data = await response.json()

        expect(data.results).toBeDefined()
        expect(Array.isArray(data.results)).toBe(true)

        data.results.forEach((movie: any) => {
            expect(movie).toHaveProperty("id")
            expect(typeof movie.id).toBe("number")

            expect(movie).toHaveProperty("title")
            expect(typeof movie.title).toBe("string")

            expect(movie).toHaveProperty("poster_path")
            expect(typeof movie.poster_path).toBe("string")

            expect(movie).toHaveProperty("backdrop_path")
            expect(typeof movie.backdrop_path).toBe("string")

            expect(movie).toHaveProperty("overview")
            expect(typeof movie.overview).toBe("string")

            expect(movie).toHaveProperty("release_date")
            expect(typeof movie.release_date).toBe("string")

            expect(movie).toHaveProperty("vote_average")
            expect(typeof movie.vote_average).toBe("number")

            expect(movie).toHaveProperty("vote_count")
            expect(typeof movie.vote_count).toBe("number")

            expect(movie).toHaveProperty("popularity")
            expect(typeof movie.popularity).toBe("number")

            expect(movie).toHaveProperty("genre_ids")
            expect(Array.isArray(movie.genre_ids)).toBe(true)
        })

        expect(data).toHaveProperty("page")
        expect(data).toHaveProperty("total_pages")
        expect(data).toHaveProperty("total_results")
    })

    it("should handle missing API key", async () => {
        delete process.env.TMDB_API_KEY

        const request = new Request("http://localhost:3000/api/trending")

        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toContain("TMDB API key is not configured")
    })

    it("should use cache for subsequent requests", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockMovieData,
        } as Response)

        const request1 = new Request("http://localhost:3000/api/trending?timeWindow=week")
        await GET(request1)

        const request2 = new Request("http://localhost:3000/api/trending?timeWindow=week")
        const response2 = await GET(request2)
        const data2 = await response2.json()

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(data2).toEqual(mockMovieData)
    })
})
