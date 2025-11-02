"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
    id: string
    name: string
    email: string
    academicQualification?: string
    createdAt: string
}

interface UserContextType {
    user: User | null
    isLoading: boolean
    error: Error | null
    clearCache: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("authToken")

                const res = await fetch("/api/me", {
                    credentials: "include",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                })

                if (!res.ok) {
                    throw new Error("Failed to fetch user")
                }

                const data = await res.json()
                setUser(data.user)
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
        setUser(null)
        setError(null)
    }

    return <UserContext.Provider value={{ user, isLoading, error, clearCache }}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within UserProvider")
    }
    return context
}
