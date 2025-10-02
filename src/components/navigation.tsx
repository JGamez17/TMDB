"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
    const pathname = usePathname()

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                        <Film className="w-6 h-6" />
                        <span>MovieDB</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                                pathname === "/" ? "text-foreground" : "text-muted-foreground",
                            )}
                        >
                            <Film className="w-4 h-4" />
                            Trending
                        </Link>
                        <Link
                            href="/favorites"
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                                pathname === "/favorites" ? "text-foreground" : "text-muted-foreground",
                            )}
                        >
                            <Heart className="w-4 h-4" />
                            Favorites
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
