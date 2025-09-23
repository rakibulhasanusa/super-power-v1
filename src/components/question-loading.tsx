"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Brain, Zap } from "lucide-react"

interface QuestionLoadingProps {
    questionCount: number
    subject: string
    onComplete?: () => void
}

const QuestionLoading: React.FC<QuestionLoadingProps> = ({ questionCount, subject, onComplete }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isTyping, setIsTyping] = useState(true)

    const messages = [
        "Your questions are being created...",
        "Wait a moment, we will create your questions for you very soon.",
        `Generating ${questionCount} ${subject} questions with AI precision.`,
        "Crafting the perfect difficulty level for your test.",
        "Almost ready! Finalizing your personalized quiz experience.",
    ]

    useEffect(() => {
        const currentMessage = messages[currentMessageIndex]
        let charIndex = 0
        setDisplayedText("")
        setIsTyping(true)

        const typingInterval = setInterval(() => {
            if (charIndex < currentMessage.length) {
                setDisplayedText(currentMessage.slice(0, charIndex + 1))
                charIndex++
            } else {
                setIsTyping(false)
                clearInterval(typingInterval)

                // Wait 2 seconds before moving to next message
                setTimeout(() => {
                    if (currentMessageIndex < messages.length - 1) {
                        setCurrentMessageIndex(currentMessageIndex + 1)
                    }
                }, 2000)
            }
        }, 50) // Typing speed

        return () => clearInterval(typingInterval)
    }, [currentMessageIndex, questionCount, subject])

    // Progress indicators
    const progressSteps = [
        { icon: Brain, label: "Analyzing Requirements", completed: currentMessageIndex >= 0 },
        { icon: Sparkles, label: "Generating Questions", completed: currentMessageIndex >= 2 },
        { icon: Zap, label: "Optimizing Difficulty", completed: currentMessageIndex >= 3 },
        { icon: Loader2, label: "Finalizing Test", completed: currentMessageIndex >= 4 },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <Card className="shadow-xl border-2">
                    <CardContent className="p-12">
                        <div className="text-center space-y-8">
                            {/* Main loading animation */}
                            <div className="relative">
                                <div className="w-24 h-24 mx-auto mb-6 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Brain className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Typing text */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-foreground">Creating Your Test</h2>
                                <div className="min-h-[3rem] flex items-center justify-center">
                                    <p className="text-lg text-muted-foreground text-center max-w-md">
                                        {displayedText}
                                        {isTyping && <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>}
                                    </p>
                                </div>
                            </div>

                            {/* Progress steps */}
                            <div className="space-y-4 pt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {progressSteps.map((step, index) => {
                                        const Icon = step.icon
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${step.completed ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                                                    }`}
                                            >
                                                <Icon
                                                    className={`w-5 h-5 ${step.completed && step.icon === Loader2
                                                        ? "animate-spin"
                                                        : step.completed
                                                            ? "animate-pulse"
                                                            : ""
                                                        }`}
                                                />
                                                <span className="text-sm font-medium">{step.label}</span>
                                                {step.completed && (
                                                    <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Test details */}
                            <div className="pt-6 border-t border-border/50">
                                <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                                    <div className="text-center">
                                        <div className="font-semibold text-foreground">{questionCount}</div>
                                        <div>Questions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-foreground">{subject}</div>
                                        <div>Subject</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-foreground">{questionCount} min</div>
                                        <div>Duration</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating particles animation */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 bg-primary/20 rounded-full animate-bounce"
                                        style={{
                                            left: `${20 + i * 15}%`,
                                            top: `${30 + (i % 2) * 40}%`,
                                            animationDelay: `${i * 0.5}s`,
                                            animationDuration: `${2 + i * 0.3}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default QuestionLoading