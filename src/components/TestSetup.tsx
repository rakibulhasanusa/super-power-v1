"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { MCQ, RateLimitError } from "@/types/mcq"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Loader2, Rocket, AlertTriangle } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import QuestionLoading from "./question-loading"
import { Textarea } from "./ui/textarea"

interface TestSetupProps {
    onStartTest: (mcqs: MCQ[]) => void
}

const formSchema = z.object({
    count: z.number().min(1).max(40),
    subject: z.string().min(1, "Subject is required"),
    topic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    language: z.enum(["bengali", "english"]),
})

type FormData = z.infer<typeof formSchema>

const TestSetup: React.FC<TestSetupProps> = ({ onStartTest }) => {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [rateLimitInfo, setRateLimitInfo] = React.useState<{
        retryAfter?: number
        resetTime?: number
    } | null>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            count: 5,
            subject: "Mathematics",
            topic: "",
            difficulty: "medium",
            language: "bengali",
        },
    })

    const subjects = [

        "Mathematics",
        "Bangla",
        "Physics",
        "Chemistry",
        "Information Technology",
        "Islamic Studies",
        "Religious Studies",
        "Biology",
        "History",
        "Geography",
        "Literature",
        "Computer Science",
        "Accounting",
        "Economics",
        "Psychology",
        "Philosophy",
        "Sociology",
        "Political Science",
        "Business Studies",
        "Environmental Science",
        "Art",
        "Music",
        "Physical Education",
        "Statistics",
        "Civics",
        "Astronomy",
        "Anthropology",
        "Linguistics",
        "Engineering",
        "Medicine",
        "Law",
        "Ethics",
    ]

    const handleStartTest = async (data: FormData) => {
        setLoading(true)
        setError(null)
        setRateLimitInfo(null)

        try {
            const response = await fetch("/api/generate-mcq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limit error
                    const rateLimitError = result as RateLimitError
                    setError(rateLimitError.error)
                    setRateLimitInfo({
                        retryAfter: rateLimitError.retryAfter,
                        resetTime: rateLimitError.resetTime,
                    })
                } else {
                    setError(result.error || "Failed to generate test")
                }
                return
            }

            if (result.success && result.mcqs) {
                onStartTest(result.mcqs)
            } else {
                setError("Failed to generate test questions")
            }
        } catch (error) {
            console.error("Failed to generate test:", error)
            setError("Network error. Please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (rateLimitInfo?.retryAfter) {
            const interval = setInterval(() => {
                setRateLimitInfo((prev) => {
                    if (!prev?.retryAfter || prev.retryAfter <= 1) {
                        setError(null)
                        return null
                    }
                    return { ...prev, retryAfter: prev.retryAfter - 1 }
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [rateLimitInfo])

    if (loading) {
        return (
            <QuestionLoading
                questionCount={form.watch("count")}
                subject={form.watch("subject")}
                onComplete={() => setLoading(false)}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">MCQ Test Platform</h1>
                    <p className="text-lg text-muted-foreground text-pretty">
                        Take a timed multiple choice test with 1 minute per question
                    </p>
                </div>

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Test Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleStartTest)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Language</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-foreground border-solid w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="bengali">Bengali</SelectItem>
                                                        <SelectItem value="english">English</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Questions</FormLabel>
                                                <Select
                                                    value={field.value.toString()}
                                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="border-foreground border-solid w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="5">5 Questions</SelectItem>
                                                        <SelectItem value="10">10 Questions</SelectItem>
                                                        <SelectItem value="15">15 Questions</SelectItem>
                                                        <SelectItem value="20">20 Questions</SelectItem>
                                                        <SelectItem value="25">25 Questions</SelectItem>
                                                        <SelectItem value="30">30 Questions</SelectItem>
                                                        <SelectItem value="40">40 Questions</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel>Subject</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-foreground border-solid w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {subjects.map((subject) => (
                                                            <SelectItem key={subject} value={subject}>
                                                                {subject}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="difficulty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Difficulty Level</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-foreground border-solid w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="easy">Easy</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="topic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Topic (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Algebra, World War II, Organic Chemistry"
                                                    className="border-foreground border-solid w-full"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            {error}
                                            {rateLimitInfo?.retryAfter && (
                                                <div className="mt-2 font-mono">Retry in: {rateLimitInfo.retryAfter} seconds</div>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Alert>
                                    <Clock className="h-4 w-4" />
                                    <AlertDescription>
                                        <span className="font-semibold">Test Duration: {form.watch("count")} Minutes</span>
                                        <br />
                                        The test will automatically submit when time expires. Make sure you have a stable internet
                                        connection.
                                    </AlertDescription>
                                </Alert>

                                <Button
                                    type="submit"
                                    disabled={loading || !!rateLimitInfo?.retryAfter}
                                    className="w-full py-6 text-lg font-semibold cursor-pointer"
                                    size="lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating Test...
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="mr-2 h-5 w-5" />
                                            Start {form.watch("count")} Question Test
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TestSetup
