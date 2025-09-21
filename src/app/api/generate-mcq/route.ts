import { generateObject } from "ai"
import { z } from "zod"

const mcqSchema = z.object({
    questions: z.array(
        z.object({
            question: z.string().describe("The multiple choice question"),
            options: z.array(z.string()).length(4).describe("Four answer options"),
            correctAnswer: z.number().min(0).max(3).describe("Index of the correct answer (0-3)"),
            explanation: z.string().describe("Explanation of why the correct answer is right"),
        }),
    ),
    topic: z.string().describe("The topic of the quiz"),
    difficulty: z.string().describe("The difficulty level"),
})

export async function POST(req: Request) {
    try {
        const { topic, difficulty, numQuestions, context } = await req.json()

        if (!topic) {
            return Response.json({ error: "Topic is required" }, { status: 400 })
        }

        if (!process.env.AI_GATEWAY_API_KEY) {
            return Response.json({ error: "AI Gateway API key not configured" }, { status: 500 })
        }

        const prompt = `Generate ${numQuestions} multiple choice questions about "${topic}" at ${difficulty} difficulty level.

${context ? `Additional context: ${context}` : ""}

Requirements:
- Each question should have exactly 4 options
- Questions should be clear and unambiguous
- Options should be plausible but only one correct
- Include detailed explanations for correct answers
- Vary question types (factual, conceptual, application-based)
- Ensure questions are appropriate for ${difficulty} difficulty level

Make the questions educational and engaging.`

        const { object } = await generateObject({
            model: "gpt-4o", // AI Gateway will automatically route this
            schema: mcqSchema,
            prompt,
        })

        return Response.json(object)
    } catch (error) {
        console.error("Error generating MCQ:", error)
        return Response.json({ error: "Failed to generate MCQ questions" }, { status: 500 })
    }
}
