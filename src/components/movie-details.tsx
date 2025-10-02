import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, Calendar, Clock, DollarSign } from "lucide-react"
import { FavoriteButton } from "./favorite-button"
import Image from "next/image"

async function getMovieDetails(movieId: string) {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
        "http://localhost:3000"

    const apiUrl = `${baseUrl}/api/movies/${movieId}`

    const response = await fetch(apiUrl, {
        next: { revalidate: 3600 },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}

export async function MovieDetails({ movieId }: { movieId: string }) {
    const movie = await getMovieDetails(movieId)

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.svg?height=750&width=500"

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null

    return (
        <div className="relative">
            {/* Backdrop with gradient overlay */}
            {backdropUrl && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <Image
                        src={backdropUrl || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover opacity-20 blur-sm"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
                </div>
            )}

            <div className="grid md:grid-cols-[300px_1fr] gap-8 relative">
                {/* Poster */}
                <Card className="overflow-hidden border-0 shadow-2xl">
                    <Image
                        src={posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </Card>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">{movie.title}</h1>
                            <FavoriteButton movieId={movie.id} />
                        </div>
                        {movie.tagline && <p className="text-lg text-muted-foreground italic text-pretty">{movie.tagline}</p>}
                    </div>

                    {/* Rating and Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
                            <span className="text-muted-foreground">({movie.vote_count.toLocaleString()} votes)</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>

                        {movie.runtime && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre: any) => (
                                <Badge key={genre.id} variant="secondary">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Overview */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-foreground">Overview</h2>
                        <p className="text-muted-foreground leading-relaxed text-pretty">{movie.overview}</p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                        {movie.budget > 0 && (
                            <Card className="p-4 bg-card/50">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm font-medium">Budget</span>
                                </div>
                                <p className="text-lg font-semibold text-foreground">${(movie.budget / 1000000).toFixed(1)}M</p>
                            </Card>
                        )}

                        {movie.revenue > 0 && (
                            <Card className="p-4 bg-card/50">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm font-medium">Revenue</span>
                                </div>
                                <p className="text-lg font-semibold text-foreground">${(movie.revenue / 1000000).toFixed(1)}M</p>
                            </Card>
                        )}
                    </div>

                    {/* Production Companies */}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Production Companies</h3>
                            <div className="flex flex-wrap gap-3">
                                {movie.production_companies.slice(0, 4).map((company: any) => (
                                    <Badge key={company.id} variant="outline" className="text-xs">
                                        {company.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
