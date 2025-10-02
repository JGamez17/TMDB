export interface Movie {
    id: number
    title: string
    poster_path: string | null
    release_date: string | null
    vote_average: number | null
    overview: string | null
    backdrop_path: string | null
    budget?: number
    revenue?: number
    runtime?: number | null
    genres?: Array<{ id: number; name: string }>
    status?: string
    tagline?: string | null
}