import { MovieCard } from "./movie-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

async function getTrendingMovies() {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
        "http://localhost:3000"

    const apiUrl = `${baseUrl}/api/trending`

    try {
        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()

        if (!data || typeof data !== "object") {
            throw new Error("Invalid response format")
        }

        return data
    } catch (error) {
        console.error("Failed to fetch trending movies:", error)
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
                        We couldn't find any trending movies at the moment. Please try again later.
                    </AlertDescription>
                </Alert>
            )
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {data.results.map((movie: any) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        )
    } catch (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Unable to load trending movies. Please check your connection and try again.</AlertDescription>
            </Alert>
        )
    }
}
