"use client"

import { useState, useCallback, useRef } from "react"
import type { Movie } from "@/lib/types/movies"

interface MovieCache {
    [key: number]: Movie
}

export function useMovieCache() {
    const [cache, setCache] = useState<MovieCache>({})
    const [loading, setLoading] = useState<Set<number>>(new Set())
    const [errors, setErrors] = useState<Map<number, string>>(new Map())

    const cacheRef = useRef(cache)
    const loadingRef = useRef(loading)

    // Update refs when state changes
    cacheRef.current = cache
    loadingRef.current = loading

    const fetchMovie = useCallback(async (movieId: number): Promise<Movie | null> => {
        if (typeof movieId !== "number" || isNaN(movieId) || movieId <= 0) {
            console.error("[v0] Invalid movie ID passed to fetchMovie:", movieId, typeof movieId)
            return null
        }

        // Return cached movie if available
        if (cacheRef.current[movieId]) {
            return cacheRef.current[movieId]
        }

        // Return null if already loading
        if (loadingRef.current.has(movieId)) {
            return null
        }

        // Mark as loading
        setLoading((prev) => new Set(prev).add(movieId))

        try {
            console.log(`[v0] Fetching movie with ID: ${movieId}`)
            const response = await fetch(`/api/movies/${movieId}`)

            if (!response.ok) {
                throw new Error(`Failed to fetch movie ${movieId}: ${response.status} ${response.statusText}`)
            }

            const movie: Movie = await response.json()

            // Add to cache
            setCache((prev) => ({
                ...prev,
                [movieId]: movie,
            }))

            // Clear error if it existed
            setErrors((prev) => {
                const newErrors = new Map(prev)
                newErrors.delete(movieId)
                return newErrors
            })

            return movie
        } catch (error) {
            console.error(`[v0] Error fetching movie ${movieId}:`, error)
            setErrors((prev) => new Map(prev).set(movieId, error instanceof Error ? error.message : "Unknown error"))
            return null
        } finally {
            // Remove from loading
            setLoading((prev) => {
                const newLoading = new Set(prev)
                newLoading.delete(movieId)
                return newLoading
            })
        }
    }, [])

    const fetchMovies = useCallback(
        async (movieIds: (number | string)[]): Promise<Movie[]> => {
            // First convert any string IDs to numbers and validate all IDs
            const validIds = movieIds
                .map(id => {
                    if (typeof id === 'string') {
                        const parsed = parseInt(id, 10)
                        return !isNaN(parsed) ? parsed : null
                    }
                    return typeof id === 'number' && !isNaN(id) && id > 0 ? id : null
                })
                .filter((id): id is number => id !== null)

            if (validIds.length !== movieIds.length) {
                console.warn(
                    "[v0] Filtered out invalid movie IDs:",
                    movieIds.filter((_, index) => !validIds[index]),
                )
            }

            if (validIds.length === 0) {
                console.error("[v0] No valid movie IDs to fetch:", movieIds)
                return []
            }

            const moviePromises = validIds.map((id) => fetchMovie(id))
            const results = await Promise.all(moviePromises)
            return results.filter((movie): movie is Movie => movie !== null)
        },
        [fetchMovie],
    )

    const getCachedMovie = useCallback(
        (movieId: number): Movie | undefined => {
            return cache[movieId]
        },
        [cache],
    )

    const isMovieLoading = useCallback(
        (movieId: number): boolean => {
            return loading.has(movieId)
        },
        [loading],
    )

    const getMovieError = useCallback(
        (movieId: number): string | undefined => {
            return errors.get(movieId)
        },
        [errors],
    )

    const clearCache = useCallback(() => {
        setCache({})
        setErrors(new Map())
    }, [])

    return {
        cache,
        fetchMovie,
        fetchMovies,
        getCachedMovie,
        isMovieLoading,
        getMovieError,
        clearCache,
    }
}
