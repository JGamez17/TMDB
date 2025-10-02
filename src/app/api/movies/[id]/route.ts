import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 60 minutes

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        if (!TMDB_API_KEY) {
            return NextResponse.json(
                {
                    error:
                        "TMDB API key is not configured. Please set TMDB_API_KEY in Project Settings (click the gear icon in the top right).",
                },
                { status: 500 },
            )
        }

        // Extract and validate the movie ID
        const params = await context.params
        const movieId = params.id

        if (!movieId || typeof movieId !== 'string') {
            return NextResponse.json(
                { error: "Invalid movie ID type" },
                { status: 400 }
            )
        }

        // Ensure the ID is numeric
        const numericId = parseInt(movieId, 10)
        if (isNaN(numericId)) {
            return NextResponse.json(
                { error: "Movie ID must be a number" },
                { status: 400 }
            )
        }

        const cacheKey = `movie-${numericId}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data)
        }

        // Fetch from TMDB
        const response = await fetch(`${TMDB_BASE_URL}/movie/${numericId}?api_key=${TMDB_API_KEY}`, {
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: `Movie with ID ${numericId} not found` },
                    { status: 404 }
                )
            }
            return NextResponse.json(
                { error: `TMDB API error: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Update cache
        cache.set(cacheKey, { data, timestamp: Date.now() })

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in movie details API:", error)
        return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
    }
}
