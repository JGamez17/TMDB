"use client"

import { MovieCard } from "./movie-card"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import type { Movie } from "@/lib/types/movies"
import { Alert } from "@/components/ui/alert"

export function FavoritesGrid() {
    const { favorites: favoriteIds, isLoading: isFavoritesLoading } = useFavorites()
    const [movies, setMovies] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadFavorites() {
            if (favoriteIds.length === 0) {
                setIsLoading(false)
                return
            }

            try {
                const moviePromises = favoriteIds.map((id) => {
                    const movieId = id.toString()
                    return fetch(`/api/movies/${movieId}`).then((res) => {
                        if (!res.ok) throw new Error(`Failed to fetch movie ${movieId}`)
                        return res.json()
                    })
                })

                const movies = await Promise.all(moviePromises)
                setMovies(movies)
                setError(null)
            } catch (error) {
                console.error("Failed to load favorites:", error)
                setError("Failed to load favorite movies. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        if (!isFavoritesLoading) {
            setIsLoading(true)
            loadFavorites()
        }
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
                <p>{error}</p>
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


