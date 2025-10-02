import { MovieDetails } from "@/components/movie-details"
import { notFound } from "next/navigation"

interface MovieDetailsResponse {
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

async function getMovieDetails(id: string): Promise<MovieDetailsResponse> {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const host = process.env.VERCEL_URL || 'localhost:3000'
    const res = await fetch(`${protocol}://${host}/api/movie/${id}`, {
        cache: 'no-store'
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch movie details: ${res.statusText}`)
    }

    return res.json()
}

export default async function MoviePage({ params }: { params: { id: string } }) {
    try {
        const movie = await getMovieDetails(params.id)
        return <MovieDetails movie={movie} />
    } catch (error) {
        console.error("[v0] Error loading movie details:", error)
        notFound()
    }
}