import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const timeWindow = searchParams.get("timeWindow") || "week"
        const cacheKey = `trending-${timeWindow}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data)
        }

        // Fetch from TMDB
        const response = await fetch(`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`, {
            next: { revalidate: 1800 },
        })

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`)
        }

        const data = await response.json()

        // Update cache
        cache.set(cacheKey, { data, timestamp: Date.now() })

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in trending movies API:", error)
        return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 })
    }
}
