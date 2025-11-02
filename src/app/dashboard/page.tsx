"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { LogOut, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function DashboardPage() {
    const router = useRouter()
    const { user, isLoading, error, clearCache } = useUser();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Logout failed")
            }

            clearCache()
            toast.success("Logged out successfully")
            router.push("/login")
        } catch (error) {
            toast.error("Logout failed")
            console.error("Logout error:", error)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return null
    }

    const initials = user.name
        .split(" ")
        .map((n: any) => n[0])
        .join("")
        .toUpperCase()

    return (
        <main className="min-h-screen bg-background p-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                <p className="text-base font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                <p className="text-base font-semibold">{user.email}</p>
                            </div>

                            {user.academicQualification && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Academic Qualification</p>
                                        <p className="text-base font-semibold">{user.academicQualification}</p>
                                    </div>
                                </>
                            )}

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                <p className="text-base font-semibold">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session Information</CardTitle>
                        <CardDescription>Details about your current session</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">User ID</p>
                                <code className="text-xs bg-muted px-2 py-1 rounded block truncate">{user.id}</code>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Session Type</p>
                                <Badge variant="outline">In-Memory Cache</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Caching Behavior</p>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>User data cached after login</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>No repeated backend requests</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Cache cleared on logout</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}