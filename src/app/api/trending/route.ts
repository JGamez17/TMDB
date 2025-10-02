import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export const dynamic = 'force-dynamic'

interface TrendingResponse {
    page: number
    results: Array<{
        id: number
        title: string
        overview: string | null
        poster_path: string | null
        backdrop_path: string | null
        release_date: string | null
        vote_average: number
        vote_count: number
    }>
    total_pages: number
    total_results: number
}

export async function GET() {
    try {
        if (!TMDB_API_KEY) {
            return NextResponse.json(
                { error: "TMDB API key is not configured" },
                { status: 500 }
            )
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        )

        if (!response.ok) {
            console.error("[v0] TMDB API error:", response.status, response.statusText)
            return NextResponse.json(
                { error: "Failed to fetch trending movies" },
                { status: response.status }
            )
        }

        const data = await response.json() as TrendingResponse
        return NextResponse.json(data)
    } catch (error) {
        console.error("[v0] Unexpected error:", error)
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}