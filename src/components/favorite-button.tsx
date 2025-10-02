"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
    movieId: string | number
    variant?: "default" | "outline" | "ghost"
    size?: "icon" | "default"
    className?: string
}

export function FavoriteButton({
    movieId,
    variant = "outline",
    size = "icon",
    className
}: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite, isLoading } = useFavorites()
    const id = typeof movieId === "string" ? parseInt(movieId, 10) : movieId
    const isActive = isFavorite(id)

    if (isLoading) {
        return (
            <Button variant={variant} size={size} disabled className={className}>
                <Heart className="w-5 h-5 animate-pulse" />
            </Button>
        )
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(
                className,
                isActive && "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/50",
                "transition-all duration-300"
            )}
            onClick={(e) => {
                e.preventDefault() // Prevent navigation if inside a link
                toggleFavorite(id)
            }}
            aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "fill-pink-500 text-pink-500 scale-110"
                )}
            />
            {size === "default" && (
                <span className="ml-2">
                    {isActive ? "Remove from favorites" : "Add to favorites"}
                </span>
            )}
        </Button>
    )
}
