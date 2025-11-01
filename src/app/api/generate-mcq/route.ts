import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { checkRateLimit, getClientIP, logRateLimit } from "@/lib/rate-limiter"

// MCQ schema definition with validation rules
const mcqSchema = z.object({
    id: z.number(),
    subject: z.string(),
    topic: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    question: z.string(),
    options: z
        .array(
            z.object({
                label: z.enum(["A", "B", "C", "D"]),
                text: z.string(),
            }),
        )
        .length(4),
    correctAnswer: z.enum(["A", "B", "C", "D"]),
    explanation: z.string(),
    timeToSolve: z.number().optional(),
    tags: z.array(z.string()).optional(),
})

// Request body schema with validation and defaults
const requestSchema = z.object({
    count: z.number().min(1).max(40).default(10),
    subject: z.string().default("General"),
    topic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    language: z.enum(["english", "bengali"]),
    examType: z.string().optional(),
});

function corsHeaders(origin?: string | null) {
    const allowedOrigins = [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://jobpreai.vercel.app",
    ]
    const originHeader = origin || allowedOrigins[0]
    const allowOrigin = allowedOrigins.includes(originHeader) ? originHeader : allowedOrigins[0]

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get("origin")
    return NextResponse.json({}, { headers: corsHeaders(origin) })
}

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"
    const endpoint = "/api/generate-mcq"

    try {
        // const rateLimitResult = await checkRateLimit(clientIP)

        // Log the rate limit check
        // logRateLimit(clientIP, rateLimitResult.allowed, rateLimitResult.remaining)

        // if (!rateLimitResult.allowed) {
        //     const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)

        //     return NextResponse.json(
        //         {
        //             success: false,
        //             error: `Rate limit exceeded. You can make 4 requests per minute. Please try again in ${retryAfter} seconds.`,
        //             retryAfter,
        //             resetTime: rateLimitResult.resetTime,
        //         },
        //         {
        //             status: 429,
        //             headers: {

        //                 "Retry-After": String(retryAfter),
        //                 "X-RateLimit-Limit": "4",
        //                 "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        //                 "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetTime / 1000)),
        //             },
        //         },
        //     )
        // }

        // Parse and validate request body
        const body = await request.json()
        const validatedData = requestSchema.parse(body)

        const { count, subject, topic, difficulty, language, examType } = validatedData

        // Determine if we need Bengali or English prompt
        const promptInBengali = language === "bengali"

        // Create language-specific prompt
        const basePrompt = promptInBengali
            ? `ঠিক ${count}টি বহুনির্বাচনী প্রশ্ন তৈরি করুন ${subject} বিষয়ে${topic ? ` বিশেষভাবে ${topic} টপিকে` : ""} ${difficulty} অসুবিধার স্তরে।

        গুরুত্বপূর্ণ শর্তাবলী:
        - প্রতিটি প্রশ্নে ৪টি অপশন থাকবে যা একে অপরের খুব কাছাকাছি
        - সব অপশনই যুক্তিযুক্ত হতে হবে - কোনো স্পষ্ট ভুল উত্তর নয়
        - বিভ্রান্তিকর অপশনগুলো প্রকৃত বোঝাপড়া পরীক্ষা করবে
        - প্রশ্নের নম্বর ১ থেকে ${count} পর্যন্ত
        - স্পষ্ট ব্যাখ্যা দিন
        - সময়বদ্ধ পরীক্ষার জন্য উপযুক্ত প্রশ্ন তৈরি করুন
        ${examType ? `- ${examType} পরীক্ষার ধরনের জন্য উপযুক্ত করুন` : ""}

        সব প্রশ্ন ও উত্তর বাংলায় লিখুন।`
            : `Generate exactly ${count} multiple choice questions about ${subject}${topic ? ` focusing on ${topic}` : ""} at ${difficulty} difficulty level.

        CRITICAL REQUIREMENTS:
        - Each question must have 4 options that are VERY CLOSE to each other
        - All options should be plausible - no obviously wrong answers
        - Distractors should test genuine understanding
        - Number questions from 1 to ${count}
        - Provide clear explanations
        - Make questions suitable for a timed test environment
        ${examType ? `- Make it suitable for ${examType} exam type` : ""}`

        const { object } = await generateObject({
            model: "gpt-4o",
            schema: z.object({
                mcqs: z.array(mcqSchema).length(count),
            }),
            prompt: basePrompt,
            temperature: 0.7,
        })

        const processingTime = Date.now() - startTime

        console.log("[MCQ_GENERATION_SUCCESS]", {
            ip: clientIP,
            userAgent: userAgent,
            count: object.mcqs.length,
            subject,
            topic,
            difficulty,
            language,
            processingTimeMs: processingTime,
            // rateLimitRemaining: rateLimitResult.remaining,
            timestamp: new Date().toISOString(),
        })

        const origin = request.headers.get("origin")
        return NextResponse.json(
            {
                success: true,
                mcqs: object.mcqs,
                metadata: {
                    totalQuestions: object.mcqs.length,
                    subject,
                    topic,
                    difficulty,
                    language,
                    examType,
                    generatedAt: new Date().toISOString(),
                    processingTimeMs: processingTime,
                },
            },
            {
                headers: {
                    ...corsHeaders(origin),
                    "X-RateLimit-Limit": "4",
                    // "X-RateLimit-Remaining": String(rateLimitResult.remaining),
                    // "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetTime / 1000)),
                },
            },
        )
    } catch (error) {
        const processingTime = Date.now() - startTime;

        console.error("[MCQ_GENERATION_ERROR]", {
            ip: clientIP,
            userAgent: userAgent.slice(0, 100),
            endpoint,
            error: error instanceof Error ? error.message : "Unknown error",
            processingTimeMs: processingTime,
            timestamp: new Date().toISOString(),
        })

        const origin = request.headers.get("origin")
        const corsHeadersObj = corsHeaders(origin)

        // Handle Zod validation errors specifically
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid request data",
                    details: error.issues,
                },
                { status: 400, headers: corsHeadersObj },
            )
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as any).message === "string" &&
            (error as any).message.includes("rate limit")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "External API rate limit exceeded. Please try again later.",
                },
                { status: 429, headers: corsHeadersObj },
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to generate MCQs. Please try again.",
                timestamp: new Date().toISOString(),
            },
            { status: 500, headers: corsHeadersObj },
        )
    }
}

export async function GET(request: NextRequest) {
    const startTime = Date.now()
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"
    const endpoint = "/api/generate-mcq"

    // Check current rate limit status


    try {
        const rateLimitResult = await checkRateLimit(clientIP)

        // Log the rate limit check
        logRateLimit(clientIP, rateLimitResult.allowed, rateLimitResult.remaining)

        if (!rateLimitResult.allowed) {
            const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)

            const origin = request.headers.get("origin")
            return NextResponse.json(
                {
                    success: false,
                    error: `Rate limit exceeded. You can make 4 requests per minute. Please try again in ${retryAfter} seconds.`,
                    retryAfter,
                    resetTime: rateLimitResult.resetTime,
                },
                {
                    status: 429,
                    headers: {
                        ...corsHeaders(origin),
                        "Retry-After": String(retryAfter),
                        "X-RateLimit-Limit": "4",
                        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
                        "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetTime / 1000)),
                    },
                },
            )
        }

        const origin = request.headers.get("origin")
        return NextResponse.json(
            {
                message: "MCQ Generator API is running",
                rateLimit: {
                    limit: 4,
                    remaining: rateLimitResult.remaining,
                    resetTime: rateLimitResult.resetTime,
                    windowMs: 60000,
                },
                endpoints: {
                    POST: "/api/generate-mcq",
                    description: "Generate multiple choice questions",
                    parameters: {
                        count: "number (1-40, default: 10)",
                        subject: "string (default: General)",
                        topic: "string (optional)",
                        difficulty: "easy|medium|hard (default: medium)",
                        language: "english|bengali (default: english)",
                        examType: "string (optional, e.g., BCS, University)",
                    },
                },
            },
            {
                headers: {
                    ...corsHeaders(origin),
                    "X-RateLimit-Limit": "4",
                    "X-RateLimit-Remaining": String(rateLimitResult.remaining),
                    "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetTime / 1000)),
                },
            },
        )
    } catch (error) {
        console.error("[RATE_LIMIT_CHECK_ERROR]", {
            ip: clientIP,
            userAgent: userAgent.slice(0, 100),
            endpoint,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        })

        const origin = request.headers.get("origin")
        return NextResponse.json(
            {
                success: false,
                error: "Failed to check rate limit",
            },
            { status: 500, headers: corsHeaders(origin) },
        )
    }
}
