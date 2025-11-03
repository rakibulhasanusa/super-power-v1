import React from 'react'
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
                <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Please sign in to view your results.</p>
            </div>
        )
    }

    const payload = await verifySession(token)
    if (!payload) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Your session has expired. Please sign in again.</p>
            </div>
        )
    }

    const rows = await db
        .select()
        .from(testResults)
        .where(eq(testResults.userId, payload.userId))
        .orderBy(desc(testResults.createdAt))

    const hasAny = rows.length > 0

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Your Results</h1>
                <p className="text-muted-foreground">Recent test attempts and scores</p>
            </div>

            {!hasAny ? (
                <div className="rounded-lg border p-6 text-center">
                    <p className="text-muted-foreground">No results yet. Take your first test to see history here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">Correct</th>
                                <th className="px-4 py-3">Wrong</th>
                                <th className="px-4 py-3">Unanswered</th>
                                <th className="px-4 py-3">Questions</th>
                                <th className="px-4 py-3">Time (s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-4 py-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-3 font-medium">{r.percentage}%</td>
                                    <td className="px-4 py-3">{r.correctAnswers}</td>
                                    <td className="px-4 py-3">{r.wrongAnswers}</td>
                                    <td className="px-4 py-3">{r.unanswered}</td>
                                    <td className="px-4 py-3">{r.totalQuestions}</td>
                                    <td className="px-4 py-3">{r.timeTaken}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
