"use client"

import { useEffect, useState } from "react"

interface User {
    id: string
    name: string
    email: string
    academicQualification?: string
    createdAt: string
}

let cachedUser: User | null = null

export function useUser() {
    const [user, setUser] = useState<User | null>(cachedUser)
    const [isLoading, setIsLoading] = useState(!cachedUser)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (cachedUser) {
            setUser(cachedUser)
            setIsLoading(false)
            return
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include",
                })

                if (!res.ok) {
                    throw new Error("Failed to fetch user")
                }

                const data = await res.json()
                cachedUser = data.user
                setUser(cachedUser)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"))
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    const clearCache = () => {
        cachedUser = null
        setUser(null)
    }

    return {
        user,
        isLoading,
        error,
        clearCache,
    }
}
