import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

interface MovieResponse {
    page: number
    results: Array<{
        id: number
        title?: string
        poster_path?: string | null
        overview?: string | null
        release_date?: string | null
        vote_average?: number | null
    }>
    total_pages: number
    total_results: number
}

export const dynamic = 'force-dynamic' // Opt out of static generation for this route

export async function GET(request: Request) {
    try {
        if (!TMDB_API_KEY) {
            console.error("[v0] TMDB_API_KEY is not set!")
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

        // Fetch from TMDB
        console.log("[v0] Fetching trending movies from TMDB API")
        const response = await fetch(`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            console.error("[v0] TMDB API error:", response.status, response.statusText)
            return NextResponse.json({ error: "Failed to fetch from TMDB API" }, { status: response.status })
        }

        const data = (await response.json()) as MovieResponse
        console.log("[v0] Successfully fetched trending movies")

        return NextResponse.json(data)
    } catch (error) {
        console.error("[v0] Error in trending movies API:", error)
        return NextResponse.json({ error: "Failed to fetch trending movies" }, { status: 500 })
    }
}