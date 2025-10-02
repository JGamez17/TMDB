import { MovieGrid } from "@/components/movie-grid"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2 text-balance">Trending Movies</h1>
          <p className="text-muted-foreground text-lg">Discover the most popular movies this week</p>
        </header>

        <Suspense fallback={<MovieGridSkeleton />}>
          <MovieGrid />
        </Suspense>
      </div>
    </main>
  )
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-muted rounded-lg mb-3" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
