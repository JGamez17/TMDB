"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
        <Link
            href={`/movie/${movie.id}`}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            aria-label={`View details for ${movie.title}`}
        >
            <Card className="group overflow-hidden border-0 bg-card hover:bg-accent/50 focus-within:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-within:scale-105 focus-within:shadow-2xl cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    <Image
                        src={posterUrl}
                        alt={movie.title || "Movie poster"}
                        className={`object-cover transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                            } group-hover:scale-110 group-focus-within:scale-110`}
                        onLoad={() => setImageLoaded(true)}
                        fill
                        priority={false}
                    />

                    {/* Rating badge */}
                    {movie.vote_average && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-white">{rating}</span>
                        </div>
                    )}

                    {/* Gradient overlay on hover/focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-3">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 text-balance group-hover:text-accent-foreground group-focus-within:text-accent-foreground">{movie.title}</h3>
                    <p className="text-xs text-muted-foreground">{releaseYear}</p>
                </div>
            </Card>
        </Link>
    )
}
