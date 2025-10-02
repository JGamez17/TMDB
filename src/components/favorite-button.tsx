"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface FavoriteButtonProps {
    movieId: number
}

export function FavoriteButton({ movieId }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if movie is in favorites
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(movieId))
        setIsLoading(false)
    }, [movieId])

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

        if (isFavorite) {
            // Remove from favorites
            const updated = favorites.filter((id: number) => id !== movieId)
            localStorage.setItem("favorites", JSON.stringify(updated))
            setIsFavorite(false)
        } else {
            // Add to favorites
            const updated = [...favorites, movieId]
            localStorage.setItem("favorites", JSON.stringify(updated))
            setIsFavorite(true)
        }
    }

    if (isLoading) {
        return (
            <Button variant="outline" size="icon" disabled>
                <Heart className="w-5 h-5" />
            </Button>
        )
    }

    return (
        <Button
            variant={isFavorite ? "default" : "outline"}
            size="icon"
            onClick={toggleFavorite}
            className="transition-all duration-300 hover:scale-110"
        >
            <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
    )
}
