"use client"
import type React from "react"
import { useState } from "react"
import type { MCQ } from "@/types/mcq"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Loader2, Rocket } from "lucide-react"

interface TestSetupProps {
    onStartTest: (mcqs: MCQ[]) => void
}

const TestSetup: React.FC<TestSetupProps> = ({ onStartTest }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        count: 5,
        subject: "Mathematics",
        topic: "",
        difficulty: "medium" as "easy" | "medium" | "hard",
    })

    const subjects = [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "History",
        "Geography",
        "Literature",
        "Computer Science",
        "Accounting",
    ]

    const handleStartTest = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/generate-mcq-one", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            if (data.success) {
                onStartTest(data.mcqs)
            }
        } catch (error) {
            console.log({ error })
            console.error("Failed to generate test:", error)
        } finally {
            setLoading(false)
        }
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 font-mono leading-4 border-black">
                                <Label htmlFor="question-count">Number of Questions</Label>
                                <Select
                                    value={formData.count.toString()}
                                    onValueChange={(value) => setFormData({ ...formData, count: Number.parseInt(value) })}
                                >
                                    <SelectTrigger className="border-foreground border-solid" id="question-count">
                                        <SelectValue />
                                    </SelectTrigger>
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select
                                    value={formData.subject}
                                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                                >
                                    <SelectTrigger className="border-foreground border-solid" id="subject">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject} value={subject}>
                                                {subject}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic (Optional)</Label>
                                <Input className="border-foreground border-solid"
                                    id="topic"
                                    type="text"
                                    placeholder="e.g., Calculus, World War II"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty Level</Label>
                                <Select
                                    value={formData.difficulty}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, difficulty: value as typeof formData.difficulty })
                                    }
                                >
                                    <SelectTrigger className="border-foreground border-solid" id="difficulty">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                                <span className="font-semibold">Test Duration: {formData.count} Minutes</span>
                                <br />
                                The test will automatically submit when time expires. Make sure you have a stable internet connection.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={handleStartTest}
                            disabled={loading}
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
                                    Start {formData.count} Question Test
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TestSetup
