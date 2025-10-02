import { MovieCard } from "./movie-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define the Movie type based on the structure of your movie objects
type Movie = {
    id: number
    title?: string
    poster_path?: string | null
    overview?: string | null
    release_date?: string | null
    vote_average?: number | null
} & Record<string, unknown>

interface MovieResponse {
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
}

async function getTrendingMovies(): Promise<MovieResponse> {
    // In server components, we need to use absolute URLs
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const host = process.env.VERCEL_URL || 'localhost:3000'
    const apiUrl = `${protocol}://${host}/api/trending`

    console.log("[v0] Fetching trending movies from:", apiUrl)

    try {
        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            let errorData = { error: "Failed to fetch trending movies" }
            try {
                errorData = await response.json()
            } catch { }
            console.error("[v0] Failed to fetch trending movies:", response.status, response.statusText, errorData)
            throw new Error(errorData.error || `Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Successfully fetched trending movies, count:", data.results?.length)

        if (!data || typeof data !== "object") {
            throw new Error("Invalid response format")
        }

        return data
    } catch (error) {
        console.error("[v0] Failed to fetch trending movies:", error)
        throw error
    }
}

export async function MovieGrid() {
    try {
        const data = await getTrendingMovies()

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            return (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No movies found</AlertTitle>
                    <AlertDescription>
                        We couldn&apos;t find any trending movies at the moment. Please try again later.
                    </AlertDescription>
                </Alert>
            )
        }

        // Define the Movie type based on the structure of your movie objects
        type Movie = {
            id: number
            title?: string
            poster_path?: string | null
            overview?: string | null
            release_date?: string | null
            vote_average?: number | null
        } & Record<string, unknown>

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {data.results.map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        )
    } catch (error) {
        console.error("[v0] MovieGrid error:", error)
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Unable to load trending movies. Please check your connection and try again.</AlertDescription>
            </Alert>
        )
    }
}
