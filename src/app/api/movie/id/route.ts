import { NextResponse } from "next/server"

const TMDB_API_KEY = "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 60 minutes

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const movieId = params.id
        const cacheKey = `movie-${movieId}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log("[v0] Returning cached movie details for ID:", movieId)
            return NextResponse.json(cached.data)
        }

        // Fetch from TMDB
        console.log("[v0] Fetching movie details from TMDB API for ID:", movieId)
        const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`, {
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            console.error("[v0] TMDB API error:", response.status, response.statusText)
            throw new Error(`TMDB API error: ${response.status}`)
        }

        const data = await response.json()

        // Update cache
        cache.set(cacheKey, { data, timestamp: Date.now() })
        console.log("[v0] Successfully fetched and cached movie details")

        return NextResponse.json(data)
    } catch (error) {
        console.error("[v0] Error in movie details API:", error)
        return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
    }
}
