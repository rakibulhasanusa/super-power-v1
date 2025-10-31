## JobPrep BD — AI MCQ Generator & Test Platform

An AI-powered multiple-choice question practice platform targeting Bangladesh job preparation (BCS, Bank, Govt, and University). Users can configure a timed test, generate high‑quality MCQs in Bengali or English, take the test with a clean UI, and review detailed results and explanations.

Live demo: ("https://jobpreai.vercel.app")["https://jobpreai.vercel.app"]


### Key Features
- Real exam simulation with 1 minute per question and auto‑submit on timeout
- AI‑generated MCQs with close, plausible options and clear explanations
- Bengali and English question generation
- Configurable test setup: subject, topic, difficulty, question count
- Full test interface with nav, progress, and timer states
- Detailed results view with per‑question analysis and performance insights
- Basic rate limiting to protect the API

### Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI, shadcn‑ui components
- AI SDK (`ai`, `@ai-sdk/openai`) with OpenAI models
- Upstash Redis for rate limiting
- Vercel Analytics and Speed Insights

---

## Project Structure

```text
src/
  app/
    page.tsx                 # Marketing homepage
    mcq/page.tsx             # MCQ app container (setup → test → results)
    api/generate-mcq/route.ts# API: generates MCQs via OpenAI, with rate limit
    globals.css, layout.tsx  # App shell and styles
  components/
    TestSetup.tsx            # Config form and API call
    TestInterface.tsx        # Timer, navigation, answering
    TestResults.tsx          # Score, analysis, explanations
    ui/*                     # Reusable UI primitives
  hooks/useTimer.ts          # 1-minute-per-question timer
  lib/rate-limiter.ts        # Upstash Redis rate limit helpers
  types/mcq.ts               # Strong types for MCQ and results
```

---

## Local Development

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)
- OpenAI API key
- Upstash Redis database (REST URL and token)

### Environment Variables
Create a `.env.local` in the project root with:

```bash
# OpenAI / AI SDK
OPENAI_API_KEY=your_openai_api_key

# Upstash Redis (used for API rate limiting)
KV_MAIN_REST_API_URL=your_upstash_redis_rest_url
KV_MAIN_REST_API_TOKEN=your_upstash_redis_rest_token
```

### Install and Run

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
```

Open http://localhost:3000

---

## Usage
1. Visit the homepage and click “Start Free Practice” or go to `/mcq`.
2. Configure the test (language, question count up to 40, subject, optional topic, difficulty).
3. Start the test; use the left panel to navigate questions; timer enforces 1 minute per question.
4. Submit anytime or wait for auto‑submission when time ends.
5. Review results and detailed explanations; retake as needed.

---

## API

Endpoint: `POST /api/generate-mcq`

Request body:

```json
{
  "count": 10,                 // 1–40 (default 10)
  "subject": "Mathematics",   // default "General"
  "topic": "Algebra",         // optional
  "difficulty": "medium",     // "easy" | "medium" | "hard"
  "language": "bengali",      // "english" | "bengali"
  "examType": "BCS"           // optional
}
```

Response (success):

```json
{
  "success": true,
  "mcqs": [
    {
      "id": 1,
      "subject": "Mathematics",
      "topic": "Algebra",
      "difficulty": "medium",
      "question": "...",
      "options": [ { "label": "A", "text": "..." }, ... ],
      "correctAnswer": "B",
      "explanation": "..."
    }
  ],
  "metadata": {
    "totalQuestions": 10,
    "subject": "Mathematics",
    "difficulty": "medium",
    "language": "bengali",
    "generatedAt": "ISO",
    "processingTimeMs": 1234
  }
}
```

Rate limiting: 4 requests per 24 hours per IP (configurable in `src/lib/rate-limiter.ts`). Exceeded limit returns HTTP 429 with `retryAfter` and `resetTime`.

---

## Implementation Notes
- Strong runtime validation via Zod on both request and generated MCQ schema.
- Language‑aware prompts for high‑quality Bengali/English outputs.
- Clean UI with shadcn‑ui and Radix; responsive and accessible components.
- Timer and state machine manage transitions between setup → testing → results.

---

## Deployment

One‑click: Vercel recommended.

1. Push the repo to GitHub
2. Import into Vercel
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `KV_MAIN_REST_API_URL`
   - `KV_MAIN_REST_API_TOKEN`
4. Deploy

Build/run scripts:

```bash
pnpm build   # next build --turbopack
pnpm start   # next start
```

---

## Portfolio Highlights
- End‑to‑end AI feature: prompt design, validation, and UI/UX for testing workflow
- Robust error handling and user feedback (rate limit messaging with countdown)
- Typed React components with clean separation of concerns
- Production‑ready deployment path (Vercel) and analytics hooks available

---