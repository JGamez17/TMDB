"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        try {
            const stored = localStorage.getItem("favorites")
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    // Filter out any non-number values and ensure we have valid movie IDs
                    const validIds = parsed.filter((id) => typeof id === "number" && !isNaN(id) && id > 0)
                    setFavorites(validIds)

                    // If we filtered out invalid data, update localStorage
                    if (validIds.length !== parsed.length) {
                        console.warn("[v0] Cleaned up invalid favorite IDs from localStorage")
                        localStorage.setItem("favorites", JSON.stringify(validIds))
                    }
                } else {
                    console.warn("[v0] Invalid favorites format in localStorage, resetting to empty array")
                    localStorage.setItem("favorites", JSON.stringify([]))
                    setFavorites([])
                }
            }
        } catch (error) {
            console.error("[v0] Error loading favorites from localStorage:", error)
            // Reset to empty array on error
            localStorage.setItem("favorites", JSON.stringify([]))
            setFavorites([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addFavorite = (movieId: number) => {
        if (typeof movieId !== "number" || isNaN(movieId) || movieId <= 0) {
            console.error("[v0] Invalid movie ID:", movieId)
            return
        }

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
