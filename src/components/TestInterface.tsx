"use client"
import type React from "react"
import { useState, useEffect } from "react"
import type { MCQ, TestResult } from "@/types/mcq"
import { useTimer } from "@/hooks/useTimer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface TestInterfaceProps {
    mcqs: MCQ[]
    onTestComplete: (result: TestResult) => void
    onBackToSetup: () => void
}

const TestInterface: React.FC<TestInterfaceProps> = ({ mcqs, onTestComplete, onBackToSetup }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const timer = useTimer(mcqs.length) // 1 minute per question

    useEffect(() => {
        timer.startTimer()
    }, [])

    useEffect(() => {
        if (timer.hasEnded) {
            handleSubmitTest()
        }
    }, [timer.hasEnded])

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmitTest = () => {
        timer.stopTimer()

        const correctAnswers = mcqs.filter((mcq) => answers[mcq.id] === mcq.correctAnswer).length
        const wrongAnswers = mcqs.filter((mcq) => answers[mcq.id] && answers[mcq.id] !== mcq.correctAnswer).length
        const unanswered = mcqs.length - Object.keys(answers).length

        const result: TestResult = {
            totalQuestions: mcqs.length,
            correctAnswers,
            wrongAnswers,
            unanswered,
            score: correctAnswers,
            percentage: Math.round((correctAnswers / mcqs.length) * 100),
            timeTaken: timer.getElapsedTime(),
            answers,
            mcqs,
        }

        onTestComplete(result)
    }

    const getAnsweredCount = () => Object.keys(answers).length

    const navigateToQuestion = (index: number) => {
        setCurrentQuestion(index)
    }

    const currentMCQ = mcqs[currentQuestion]

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-semibold text-foreground">MCQ Test</h1>
                            <Badge variant="secondary">
                                Question {currentQuestion + 1} of {mcqs.length}
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Badge variant="outline">
                                Answered: {getAnsweredCount()}/{mcqs.length}
                            </Badge>

                            <Badge
                                variant={timer.timeLeft <= 120 ? "destructive" : timer.timeLeft <= 300 ? "secondary" : "default"}
                                className="px-4 py-2 font-mono text-lg font-semibold"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {timer.formatTime()}
                            </Badge>

                            <Button className="cursor-pointer" onClick={() => setShowSubmitModal(true)}>Submit Test</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                                    {mcqs.map((_, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => navigateToQuestion(index)}
                                            variant={
                                                currentQuestion === index ? "default" : answers[mcqs[index].id] ? "secondary" : "outline"
                                            }
                                            size="sm"
                                            className="w-10 h-10 p-0 cursor-pointer"
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant={
                                                currentMCQ.difficulty === "easy"
                                                    ? "secondary"
                                                    : currentMCQ.difficulty === "medium"
                                                        ? "default"
                                                        : "destructive"
                                            }
                                        >
                                            {currentMCQ.difficulty.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {currentMCQ.subject} • {currentMCQ.topic}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-foreground text-lg leading-relaxed text-pretty">{currentMCQ.question}</p>

                                <div className="space-y-3">
                                    {currentMCQ.options.map((option) => (
                                        <Button
                                            key={option.label}
                                            onClick={() => handleAnswerSelect(currentMCQ.id, option.label)}
                                            variant={answers[currentMCQ.id] === option.label ? "default" : "outline"}
                                            className="w-full text-left p-4 h-auto justify-start cursor-pointer"
                                        >
                                            <span className="font-semibold mr-3">{option.label}.</span>
                                            <span>{option.text}</span>

                                        </Button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button
                                        onClick={() => navigateToQuestion(Math.max(0, currentQuestion - 1))}
                                        disabled={currentQuestion === 0}
                                        variant="ghost"
                                        className="cursor-pointer"
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>

                                    <Button
                                        onClick={() => navigateToQuestion(Math.min(mcqs.length - 1, currentQuestion + 1))}
                                        disabled={currentQuestion === mcqs.length - 1}
                                        variant="ghost"
                                        className="cursor-pointer"
                                    >
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Test?</DialogTitle>
                        <DialogDescription>
                            You have answered {getAnsweredCount()} out of {mcqs.length} questions.
                            {getAnsweredCount() < mcqs.length && " Unanswered questions will be marked as incorrect."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
                            Cancel
                        </Button>
                        <Button className="cursor-pointer" onClick={handleSubmitTest}>Submit Test</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TestInterface
