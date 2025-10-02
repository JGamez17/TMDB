"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]")
        setFavorites(stored)
        setIsLoading(false)
    }, [])

    const addFavorite = (movieId: number) => {
        const updated = [...favorites, movieId]
        setFavorites(updated)
        localStorage.setItem("favorites", JSON.stringify(updated))
    }

    const removeFavorite = (movieId: number) => {
        const updated = favorites.filter((id) => id !== movieId)
        setFavorites(updated)
        localStorage.setItem("favorites", JSON.stringify(updated))
    }

    const isFavorite = (movieId: number) => {
        return favorites.includes(movieId)
    }

    const toggleFavorite = (movieId: number) => {
        if (isFavorite(movieId)) {
            removeFavorite(movieId)
        } else {
            addFavorite(movieId)
        }
    }

    return {
        favorites,
        isLoading,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
    }
}
