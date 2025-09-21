export interface MCQ {
    id: number;
    subject: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
    options: Array<{
        label: 'A' | 'B' | 'C' | 'D';
        text: string;
    }>;
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
}

export interface TestResult {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    score: number;
    percentage: number;
    timeTaken: string;
    answers: Record<number, string>;
    mcqs: MCQ[];
}