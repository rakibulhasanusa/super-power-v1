"use client"
import type React from "react"
import { useState } from "react"
import type { TestResult } from "@/types/mcq"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    RotateCcw,
    Eye,
    EyeOff,
    Target,
    Zap,
    Clock,
    Lightbulb,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Circle,
} from "lucide-react"

interface TestResultsProps {
    result: TestResult
    onRetakeTest: () => void
}

const TestResults: React.FC<TestResultsProps> = ({ result, onRetakeTest }) => {
    const [showDetailedResults, setShowDetailedResults] = useState(false)

    const getScoreVariant = (percentage: number) => {
        if (percentage >= 80) return "default"
        if (percentage >= 60) return "secondary"
        return "destructive"
    }

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return "A+"
        if (percentage >= 80) return "A"
        if (percentage >= 70) return "B"
        if (percentage >= 60) return "C"
        if (percentage >= 50) return "D"
        return "F"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-balance mb-2">Test Completed!</CardTitle>
                            <p className="text-muted-foreground">Here are your results</p>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2 text-primary">{result.percentage}%</div>
                                    <div className="text-muted-foreground">Overall Score</div>
                                    <Badge variant={getScoreVariant(result.percentage)} className="mt-2">
                                        Grade: {getGrade(result.percentage)}
                                    </Badge>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary mb-2">
                                        {result.correctAnswers}/{result.totalQuestions}
                                    </div>
                                    <div className="text-muted-foreground">Correct Answers</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl font-bold text-muted-foreground mb-2">{result.timeTaken}</div>
                                    <div className="text-muted-foreground">Time Taken</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Progress</span>
                                    <span>
                                        {result.correctAnswers} correct out of {result.totalQuestions}
                                    </span>
                                </div>
                                <Progress value={result.percentage} className="h-3" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="text-center p-4">
                                        <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                                        <div className="text-sm text-green-700">Correct</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-red-50 border-red-200">
                                    <CardContent className="text-center p-4">
                                        <div className="text-2xl font-bold text-red-600">{result.wrongAnswers}</div>
                                        <div className="text-sm text-red-700">Wrong</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-50 border-gray-200">
                                    <CardContent className="text-center p-4">
                                        <div className="text-2xl font-bold text-gray-600">{result.unanswered}</div>
                                        <div className="text-sm text-gray-700">Unanswered</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button onClick={onRetakeTest} size="lg" className="px-8">
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Take Another Test
                    </Button>

                    <Button
                        onClick={() => setShowDetailedResults(!showDetailedResults)}
                        variant="outline"
                        size="lg"
                        className="px-8"
                    >
                        {showDetailedResults ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
                        {showDetailedResults ? "Hide" : "Show"} Detailed Results
                    </Button>
                </div>

                {showDetailedResults && (
                    <Card className="shadow-lg overflow-hidden mb-8">
                        <CardHeader className="bg-muted/50">
                            <CardTitle>Detailed Results</CardTitle>
                            <p className="text-sm text-muted-foreground">Review each question and explanation</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {result.mcqs.map((mcq, index) => {
                                    const userAnswer = result.answers[mcq.id]
                                    const isCorrect = userAnswer === mcq.correctAnswer
                                    const isUnanswered = !userAnswer

                                    return (
                                        <div key={mcq.id} className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Badge variant="outline">Q{index + 1}</Badge>
                                                    <div className="flex items-center space-x-2">
                                                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                        {!isCorrect && !isUnanswered && <XCircle className="h-5 w-5 text-red-600" />}
                                                        {isUnanswered && <Circle className="h-5 w-5 text-gray-400" />}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">{mcq.subject}</Badge>
                                                    <Badge
                                                        variant={
                                                            mcq.difficulty === "easy"
                                                                ? "secondary"
                                                                : mcq.difficulty === "medium"
                                                                    ? "default"
                                                                    : "destructive"
                                                        }
                                                    >
                                                        {mcq.difficulty}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-medium mb-4 text-pretty">{mcq.question}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                {mcq.options.map((option) => (
                                                    <div
                                                        key={option.label}
                                                        className={`p-3 border-2 rounded-lg ${option.label === mcq.correctAnswer
                                                            ? "border-green-500 bg-green-50"
                                                            : userAnswer === option.label && !isCorrect
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-border bg-muted/30"
                                                            }`}
                                                    >
                                                        <span className="font-semibold mr-2">{option.label}.</span>
                                                        <span>{option.text}</span>
                                                        {option.label === mcq.correctAnswer && (
                                                            <Badge variant="secondary" className="ml-2 text-green-700">
                                                                Correct
                                                            </Badge>
                                                        )}
                                                        {userAnswer === option.label && !isCorrect && (
                                                            <Badge variant="destructive" className="ml-2">
                                                                Your Answer
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <Alert>
                                                <Lightbulb className="h-4 w-4" />
                                                <AlertDescription>
                                                    <span className="font-semibold">Explanation:</span> {mcq.explanation}
                                                </AlertDescription>
                                            </Alert>

                                            {isUnanswered && (
                                                <Alert className="mt-3" variant="destructive">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertDescription>This question was not answered</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Performance Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="text-center p-4">
                                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                    <div className="text-sm text-blue-600">Accuracy Rate</div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {result.totalQuestions > 0
                                            ? Math.round((result.correctAnswers / (result.totalQuestions - result.unanswered)) * 100) || 0
                                            : 0}
                                        %
                                    </div>
                                    <div className="text-xs text-blue-500">of answered questions</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="text-center p-4">
                                    <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm text-green-600">Completion Rate</div>
                                    <div className="text-xl font-bold text-green-600">
                                        {Math.round(((result.totalQuestions - result.unanswered) / result.totalQuestions) * 100)}%
                                    </div>
                                    <div className="text-xs text-green-500">questions attempted</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-purple-50 border-purple-200">
                                <CardContent className="text-center p-4">
                                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                    <div className="text-sm text-purple-600">Average Time</div>
                                    <div className="text-xl font-bold text-purple-600">
                                        {result.totalQuestions > 0
                                            ? Math.round(
                                                (13 * 60 -
                                                    Number.parseInt(result.timeTaken.split(":")[0]) * 60 -
                                                    Number.parseInt(result.timeTaken.split(":")[1])) /
                                                result.totalQuestions,
                                            )
                                            : 0}
                                        s
                                    </div>
                                    <div className="text-xs text-purple-500">per question</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                                <div className="font-semibold mb-2">Recommendations</div>
                                <div className="text-sm space-y-1">
                                    {result.percentage >= 90 && <p>• Excellent work! You have a strong understanding of the material.</p>}
                                    {result.percentage >= 70 && result.percentage < 90 && (
                                        <p>• Good job! Review the questions you missed to strengthen your knowledge.</p>
                                    )}
                                    {result.percentage >= 50 && result.percentage < 70 && (
                                        <p>• You're getting there! Focus on studying the areas where you made mistakes.</p>
                                    )}
                                    {result.percentage < 50 && (
                                        <p>• Keep practicing! Review the explanations and try studying the topics more thoroughly.</p>
                                    )}
                                    {result.unanswered > 0 && (
                                        <p>• Try to answer all questions next time - even educated guesses can improve your score.</p>
                                    )}
                                    {result.timeTaken < "10:00" && (
                                        <p>• You finished quickly! Consider taking more time to review your answers.</p>
                                    )}
                                </div>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TestResults
