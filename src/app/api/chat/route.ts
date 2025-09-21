import { generateText, streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {

    const result = streamText({
        model: 'openai/gpt-5',
        prompt: 'Invent a new holiday and describe its traditions.',
    });

    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }

    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);

    return NextResponse.json({ message: 'Check your server console for the streamed text!' });
}