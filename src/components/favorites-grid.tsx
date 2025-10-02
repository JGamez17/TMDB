"use client"

import { MovieCard } from "./movie-card"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

export function FavoritesGrid() {
    const [favorites, setFavorites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadFavorites() {
            const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]")

            if (favoriteIds.length === 0) {
                setIsLoading(false)
                return
            }

            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
                const moviePromises = favoriteIds.map((id: number) =>
                    fetch(`${backendUrl}/api/movies/${id}`).then((res) => res.json()),
                )

                const movies = await Promise.all(moviePromises)
                setFavorites(movies)
            } catch (error) {
                console.error("Failed to load favorites:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadFavorites()

        // Listen for storage changes to update favorites in real-time
        const handleStorageChange = () => {
            loadFavorites()
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[2/3] bg-muted rounded-lg mb-3" />
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No favorites yet</h2>
                <p className="text-muted-foreground max-w-md">
                    Start adding movies to your favorites by clicking the heart icon on any movie
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    )
}
