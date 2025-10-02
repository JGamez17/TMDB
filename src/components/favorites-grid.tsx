"use client"

import { MovieCard } from "./movie-card"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useMovieCache } from "@/hooks/use-movie-cache"
import type { Movie } from "@/lib/types/movies"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function FavoritesGrid() {
    const { favorites: favoriteIds, isLoading: isFavoritesLoading } = useFavorites()
    const { fetchMovies } = useMovieCache()
    const [movies, setMovies] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadFavorites() {
            if (favoriteIds.length === 0) {
                setIsLoading(false)
                setMovies([])
                return
            }

            try {
                setIsLoading(true)
                // Ensure we have valid numeric IDs
                const validIds = favoriteIds.filter(id =>
                    typeof id === 'number' && !isNaN(id) && id > 0
                )

                if (validIds.length === 0) {
                    console.warn("[v0] No valid favorite IDs found:", favoriteIds)
                    setMovies([])
                    return
                }

                console.log("[v0] Loading favorites with IDs:", validIds)
                const fetchedMovies = await fetchMovies(validIds)
                console.log("[v0] Successfully loaded", fetchedMovies.length, "favorite movies")
                setMovies(fetchedMovies)
                setError(null)
            } catch (error) {
                console.error("Failed to load favorites:", error)
                setError("Failed to load favorite movies. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        if (!isFavoritesLoading) {
            loadFavorites()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [favoriteIds, isFavoritesLoading])

    if (isLoading || isFavoritesLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse aspect-[2/3] bg-muted rounded-lg"></div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (movies.length === 0) {
        return (
            <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No favorite movies yet</h2>
                <p className="text-muted-foreground">
                    Movies you favorite will appear here. Click the heart icon on any movie to add it to your favorites.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    )
}
