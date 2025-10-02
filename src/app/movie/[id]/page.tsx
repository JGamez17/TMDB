import { MovieDetails } from "@/components/movie-details"
import { notFound } from "next/navigation"



export default async function MoviePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        // Ensure params is resolved
        const resolvedParams = await params
        const movieId = resolvedParams.id

        // Validate the ID
        if (!movieId || typeof movieId !== 'string') {
            console.error("[v0] Invalid movie ID:", movieId)
            notFound()
        }

        // Try to parse as a number to ensure it's a valid movie ID
        const numericId = parseInt(movieId, 10)
        if (isNaN(numericId)) {
            console.error("[v0] Movie ID is not a number:", movieId)
            notFound()
        }

        return <MovieDetails movieId={movieId} />
    } catch (error) {
        console.error("[v0] Error loading movie details:", error)
        notFound()
    }
}