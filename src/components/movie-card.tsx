"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Movie } from "@/lib/types/movie"

interface MovieCardProps {
    movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/abstract-movie-poster.png"

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

    return (
        <Link href={`/movie/${movie.id}`}>
            <Card className="group overflow-hidden border-0 bg-card hover:bg-accent transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    <img
                        src={posterUrl || "/placeholder.svg"}
                        alt={movie.title || "Movie poster"}
                        className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                            } group-hover:scale-110`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Rating badge */}
                    {movie.vote_average && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-white">{rating}</span>
                        </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-3">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 text-balance">{movie.title}</h3>
                    <p className="text-xs text-muted-foreground">{releaseYear}</p>
                </div>
            </Card>
        </Link>
    )
}
