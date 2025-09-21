import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';

// MCQ schema definition with validation rules
const mcqSchema = z.object({
    id: z.number(),
    subject: z.string(),
    topic: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    question: z.string(),
    options: z.array(z.object({
        label: z.enum(['A', 'B', 'C', 'D']),
        text: z.string()
    })).length(4),
    correctAnswer: z.enum(['A', 'B', 'C', 'D']),
    explanation: z.string(),
    // Additional optional fields
    timeToSolve: z.number().optional(), // Time in seconds
    tags: z.array(z.string()).optional() // Question tags for categorization
});

// Request body schema with validation and defaults
const requestSchema = z.object({
    count: z.number().min(1).max(40).default(10),
    subject: z.string().default('General'),
    topic: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    language: z.enum(['english', 'bengali']).default('bengali'),
    examType: z.string().optional() // e.g., BCS, University Admission, Job Test
});

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validatedData = requestSchema.parse(body);

        const { count, subject, topic, difficulty, language, examType } = validatedData;

        // Determine if we need Bengali or English prompt
        const promptInBengali = language === 'bengali';

        // Create language-specific prompt
        const basePrompt = promptInBengali ?
            `ঠিক ${count}টি বহুনির্বাচনী প্রশ্ন তৈরি করুন ${subject} বিষয়ে${topic ? ` বিশেষভাবে ${topic} টপিকে` : ''} ${difficulty} অসুবিধার স্তরে।

            গুরুত্বপূর্ণ শর্তাবলী:
            - প্রতিটি প্রশ্নে ৪টি অপশন থাকবে যা একে অপরের খুব কাছাকাছি
            - সব অপশনই যুক্তিযুক্ত হতে হবে - কোনো স্পষ্ট ভুল উত্তর নয়
            - বিভ্রান্তিকর অপশনগুলো প্রকৃত বোঝাপড়া পরীক্ষা করবে
            - প্রশ্নের নম্বর ১ থেকে ${count} পর্যন্ত
            - স্পষ্ট ব্যাখ্যা দিন
            - সময়বদ্ধ পরীক্ষার জন্য উপযুক্ত প্রশ্ন তৈরি করুন
            ${examType ? `- ${examType} পরীক্ষার ধরনের জন্য উপযুক্ত করুন` : ''}

            উদাহরণ কাছাকাছি অপশন:
            প্রশ্ন: "বাংলাদেশের স্বাধীনতা লাভের তারিখ কোনটি?"
            A. ২৬ মার্চ, ১৯৭১  B. ১৬ ডিসেম্বর, ১৯৭১  C. ২৩ মার্চ, ১৯৭১  D. ২৫ মার্চ, ১৯৭১

            সব প্রশ্ন ও উত্তর বাংলায় লিখুন।`
            :
            `Generate exactly ${count} multiple choice questions about ${subject}${topic ? ` focusing on ${topic}` : ''} at ${difficulty} difficulty level.

            CRITICAL REQUIREMENTS:
            - Each question must have 4 options that are VERY CLOSE to each other
            - All options should be plausible - no obviously wrong answers
            - Distractors should test genuine understanding
            - Number questions from 1 to ${count}
            - Provide clear explanations
            - Make questions suitable for a timed test environment
            ${examType ? `- Make it suitable for ${examType} exam type` : ''}

            EXAMPLE of close options:
            Question: "What is the value of π to 4 decimal places?"
            A. 3.1415  B. 3.1416  C. 3.1417  D. 3.1414`;

        // AI মডেল দিয়ে MCQ জেনারেট করা
        const { object } = await generateObject({
            model: "gpt-4o", // AI Gateway স্বয়ংক্রিয়ভাবে রাউট করবে
            schema: z.object({
                mcqs: z.array(mcqSchema).length(count)
            }),
            prompt: basePrompt,
            temperature: 0.7, // কিছুটা creativity এর জন্য
        });

        console.log('Generated MCQs:', {
            count: object.mcqs.length,
            subject,
            topic,
            difficulty,
            language
        });

        return NextResponse.json({
            success: true,
            mcqs: object.mcqs,
            metadata: {
                totalQuestions: object.mcqs.length,
                subject,
                topic,
                difficulty,
                language,
                examType,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('MCQ Generation Error:', error);

        // ভিন্ন ধরনের এরর হ্যান্ডলিং
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request data',
                    details: error.issues
                },
                { status: 400 }
            );
        }

        if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('rate limit')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Rate limit exceeded. Please try again later.'
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate MCQs. Please try again.',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// GET মেথড যোগ করা - API টেস্ট করার জন্য
export async function GET() {
    return NextResponse.json({
        message: 'MCQ Generator API is running',
        endpoints: {
            POST: '/api/generate-mcq',
            description: 'Generate multiple choice questions',
            parameters: {
                count: 'number (1-40, default: 10)',
                subject: 'string (default: General)',
                topic: 'string (optional)',
                difficulty: 'easy|medium|hard (default: medium)',
                language: 'english|bengali (default: bengali)',
                examType: 'string (optional, e.g., BCS, University)'
            }
        },
        example: {
            count: 5,
            subject: 'গণিত',
            topic: 'বীজগণিত',
            difficulty: 'medium',
            language: 'bengali',
            examType: 'বিসিএস'
        }
    });
}