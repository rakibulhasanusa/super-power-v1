import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { testResults } from "@/lib/db/schema"
import { verifySession } from "@/lib/auth"

export const maxDuration = 20

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null)
        if (!body) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
        }

        const { totalQuestions, correctAnswers, wrongAnswers, unanswered, score, percentage, timeTaken } = body;

        const token = request.cookies.get("session")?.value || request.headers.get("Authorization")?.slice(7)
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifySession(token)
        if (!payload) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
        }

        // Normalize timeTaken into integer seconds
        const timeTakenSeconds = (() => {
            if (typeof timeTaken === "number" && Number.isFinite(timeTaken)) return Math.max(0, Math.trunc(timeTaken))
            if (typeof timeTaken === "string") {
                // Accept formats like "MM:SS" or "H:MM:SS"
                const parts = timeTaken.split(":").map((p: string) => Number(p))
                if (parts.every((n) => Number.isFinite(n) && n >= 0)) {
                    if (parts.length === 2) {
                        const [mm, ss] = parts
                        return Math.max(0, mm * 60 + ss)
                    }
                    if (parts.length === 3) {
                        const [hh, mm, ss] = parts
                        return Math.max(0, hh * 3600 + mm * 60 + ss)
                    }
                }
            }
            return 0
        })()

        const [saved] = await db
            .insert(testResults)
            .values({
                userId: payload.userId,
                totalQuestions: Number(totalQuestions) || 0,
                correctAnswers: Number(correctAnswers) || 0,
                wrongAnswers: Number(wrongAnswers) || 0,
                unanswered: Number(unanswered) || 0,
                score: Number(score) || 0,
                percentage: Number(percentage) || 0,
                timeTaken: timeTakenSeconds,
            })
            .returning()

        return NextResponse.json(
            {
                success: true,
                id: saved.id,
                createdAt: saved.createdAt,
            },
            { status: 201 },
        )
    } catch (error) {
        // const message = error instanceof Error ? error.message : "Unknown error"
        return NextResponse.json({ error: "Failed to save test result" }, { status: 500 })
    }
}


