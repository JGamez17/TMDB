import { FavoritesGrid } from "@/components/favorites-grid"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function FavoritesPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Movies
                </Link>

                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-foreground mb-2 text-balance">My Favorites</h1>
                    <p className="text-muted-foreground text-lg">Your collection of favorite movies</p>
                </header>

                <Suspense fallback={<div className="text-muted-foreground">Loading favorites...</div>}>
                    <FavoritesGrid />
                </Suspense>
            </div>
        </main>
    )
}
