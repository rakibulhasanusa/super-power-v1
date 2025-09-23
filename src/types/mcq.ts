export interface MCQ {
    id: number
    subject: string
    topic: string
    difficulty: "easy" | "medium" | "hard"
    question: string
    options: {
        label: "A" | "B" | "C" | "D"
        text: string
    }[]
    correctAnswer: "A" | "B" | "C" | "D"
    explanation: string
    timeToSolve?: number
    tags?: string[]
}

export interface TestResult {
    totalQuestions: number
    correctAnswers: number
    wrongAnswers: number
    unanswered: number
    score: number
    percentage: number
    timeTaken: string
    answers: Record<number, string>
    mcqs: MCQ[]
}

export interface RateLimitError {
    success: false
    error: string
    retryAfter?: number
    resetTime?: number
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    retryAfter?: number
    resetTime?: number
}
