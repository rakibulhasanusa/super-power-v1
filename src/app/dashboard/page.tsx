import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { testResults } from "@/lib/db/schema"
import { verifySession } from "@/lib/auth"
import { desc, eq } from "drizzle-orm"

export default async function page() {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Please sign in to view your results.</p>
                </div>
            </div>
        )
    }

    const payload = await verifySession(token)
    if (!payload) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <svg className="h-6 w-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Session Expired</h1>
                    <p className="text-muted-foreground">Your session has expired. Please sign in again.</p>
                </div>
            </div>
        )
    }

    const rows = await db
        .select()
        .from(testResults)
        .where(eq(testResults.userId, payload.userId))
        .orderBy(desc(testResults.createdAt))

    const hasAny = rows.length > 0

    // Calculate stats
    const stats = hasAny ? {
        totalTests: rows.length,
        avgScore: Math.round(rows.reduce((sum, r) => sum + r.percentage, 0) / rows.length),
        bestScore: Math.max(...rows.map(r => r.percentage)),
        totalQuestions: rows.reduce((sum, r) => sum + r.totalQuestions, 0)
    } : null

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Results</h1>
                <p className="text-muted-foreground mt-1">Track your progress and performance</p>
            </div>

            {/* Stats Cards */}
            {hasAny && stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Total Tests
                        </div>
                        <div className="text-2xl font-bold">{stats.totalTests}</div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Average Score
                        </div>
                        <div className="text-2xl font-bold">{stats.avgScore}%</div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Best Score
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.bestScore}%</div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Total Questions
                        </div>
                        <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                    </div>
                </div>
            )}

            {/* Results Table */}
            {!hasAny ? (
                <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No results yet</h3>
                    <p className="text-muted-foreground">Take your first test to see your history here.</p>
                </div>
            ) : (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Correct</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Wrong</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Unanswered</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Questions</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {rows.map(r => {
                                    const scoreColor = r.percentage >= 80 ? 'text-green-600 dark:text-green-500' :
                                        r.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-500' :
                                            'text-red-600 dark:text-red-500'

                                    return (
                                        <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(r.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-lg font-bold ${scoreColor}`}>
                                                    {r.percentage}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                                    {r.correctAnswers}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                    {r.wrongAnswers}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                                    {r.unanswered}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {r.totalQuestions}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}