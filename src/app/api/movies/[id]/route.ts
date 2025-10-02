import { NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY || "9f6d57a150bc178c03111f09e9aaab5b"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export const dynamic = 'force-dynamic'

interface MovieDetails {
    id: number
    title: string
    overview: string | null
    poster_path: string | null
    backdrop_path: string | null
    release_date: string | null
    vote_average: number
    vote_count: number
    runtime: number | null
    genres: Array<{ id: number; name: string }>
    status: string
    tagline: string | null
}

export async function GET(
    _request: Request,
    context: { params: { id: string } }
) {
    try {
        if (!TMDB_API_KEY) {
            return NextResponse.json(
                { error: "TMDB API key is not configured" },
                { status: 500 }
            )
        }

        // Extract and validate the movie ID
        const movieId = await context.params.id
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

        console.log("[v0] Fetching movie details for ID:", numericId)

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${numericId}?api_key=${TMDB_API_KEY}`,
            { cache: 'no-store' }
        )

        if (!response.ok) {
            console.error("[v0] TMDB API error:", response.status, response.statusText)
            return NextResponse.json(
                { error: "Failed to fetch movie details" },
                { status: response.status }
            )
        }

        const data = await response.json() as MovieDetails
        return NextResponse.json(data)
    } catch (error) {
        console.error("[v0] Error fetching movie details:", error)
        return NextResponse.json(
            { error: "Failed to fetch movie details" },
            { status: 500 }
        )
    }
}