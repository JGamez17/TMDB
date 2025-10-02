# TMDB Movie Discovery App

A modern, full-stack Next.js movie discovery application built with the App Router. Browse trending movies, view detailed information, manage favorites, and enjoy smooth animations throughout.

## Features

- **Trending Movies** - Browse daily and weekly trending movies from TMDB
- **Movie Details** - View comprehensive information including cast, genres, ratings, and more
- **Favorites System** - Save your favorite movies with localStorage persistence
- **Smart Caching** - Client-side caching with SWR for optimal performance
- **Responsive Design** - Mobile-first design with a cinematic dark theme
- **Smooth Animations** - Framer Motion transitions and interactions
- **Error Handling** - Graceful error states with user-friendly messages
- **Unit Tests** - Comprehensive test coverage with Jest

## Technology Stack

- **Next.js 15** - React framework with App Router and API routes
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **Framer Motion** - Smooth animations and page transitions
- **SWR** - Data fetching, caching, and revalidation
- **Jest** - Testing framework with React Testing Library
- **Lucide React** - Beautiful, consistent icons

## Quick Start

### Prerequisites

- Node.js 18 or higher
- A TMDB API key (free - get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone or download the repository**

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Then edit `.env.local` and add your TMDB API key:
   \`\`\`env
   TMDB_API_KEY=your_api_key_here
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! You should see trending movies on the homepage.

### Getting a TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to [Settings > API](https://www.themoviedb.org/settings/api)
3. Request an API key (choose "Developer" option)
4. Copy your API key and add it to `.env.local`

## Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build the application for production
npm start            # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
\`\`\`

## Project Structure

\`\`\`
├── src/                     # Source directory
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes (backend)
│   │   │   ├── trending/   # Trending movies endpoint
│   │   │   └── movies/[id]/ # Movie details endpoint
│   │   ├── movie/[id]/     # Movie detail pages
│   │   ├── favorites/      # Favorites page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles & design tokens
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── movie-card.tsx  # Movie card component
│   │   ├── movie-grid.tsx  # Movie grid layout
│   │   ├── movie-details.tsx # Movie details display
│   │   ├── favorite-button.tsx # Favorite toggle button
│   │   └── navigation.tsx  # Navigation bar
│   ├── hooks/              # Custom React hooks
│   │   ├── use-favorites.ts # Favorites management
│   │   ├── use-movie-cache.ts # Movie data caching
│   │   ├── use-mobile.ts   # Mobile detection
│   │   └── use-toast.ts    # Toast notifications
│   └── lib/                # Utilities and types
│       ├── types/          # TypeScript type definitions
│       └── utils.ts        # Utility functions
├── __tests__/              # Test files
│   ├── api/                # API route tests
│   ├── components/         # Component tests
│   ├── hooks/              # Hook tests
│   └── services/           # Service tests
└── public/                 # Static assets
\`\`\`

## API Routes

The app uses Next.js API routes for the backend:

## Architecture

### Frontend Architecture

The app follows Next.js 15 App Router conventions:

- **Server Components** - Used for initial data fetching and SEO
- **Client Components** - Used for interactivity (favorites, animations)
- **API Routes** - Backend endpoints for TMDB API integration
- **Custom Hooks** - Reusable logic for favorites, caching, and UI state

### Data Flow

1. **Server Components** fetch initial data from API routes
2. **SWR** handles client-side caching and revalidation
3. **Custom hooks** manage favorites and movie cache
4. **localStorage** persists favorites across sessions

### Caching Strategy

- **API Routes**: Cache TMDB responses for 30-60 minutes
- **SWR**: Automatic revalidation on focus/reconnect
- **Movie Cache**: In-memory cache for movie details
- **HTTP Headers**: Cache-Control headers for browser caching

## Testing

The app includes comprehensive test coverage:

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
\`\`\`

### Test Structure

- **API Tests** (`__tests__/api/`) - Test API route handlers
- **Component Tests** (`__tests__/components/`) - Test React components
- **Hook Tests** (`__tests__/hooks/`) - Test custom hooks
- **Service Tests** (`__tests__/services/`) - Test business logic

### Example Test Cases

The trending API tests include:
- Successful TMDB API calls
- Failed API calls (error handling)
- Data structure validation
- Missing API key handling
- Caching behavior verification

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Performance Optimizations

- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic code splitting with Next.js
- **Caching** - Multi-layer caching (API, SWR, browser)
- **Prefetching** - Link prefetching for instant navigation
- **Lazy Loading** - Components load on demand
- **Memoization** - React.memo for expensive components

## Error Handling

The app includes comprehensive error handling:

- **Network Errors** - User-friendly error messages
- **Invalid Responses** - Graceful fallbacks
- **Missing Images** - Placeholder images
- **localStorage Failures** - Graceful degradation
- **API Rate Limits** - Proper error messages
- **404 Pages** - Custom not found pages

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Write tests for new features
4. Ensure all tests pass: `npm test`
5. Follow the existing code style
6. Write meaningful commit messages
7. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a template for your own applications.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Built with Next.js 15, React 18, and TypeScript. Deployed on Vercel.
