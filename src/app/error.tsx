"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("[v0] Error boundary caught:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
                <Button onClick={reset} className="w-full">
                    Try again
                </Button>
            </Card>
        </div>
    )
}
