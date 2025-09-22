'use client';
import React, { useState } from 'react';
import { TestResult } from '@/types/mcq';

interface TestResultsProps {
    result: TestResult;
    onRetakeTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ result, onRetakeTest }) => {
    const [showDetailedResults, setShowDetailedResults] = useState(false);

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Results Header */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Completed! 🎉</h1>
                            <p className="text-gray-600">Here are your results</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
                                    {result.percentage}%
                                </div>
                                <div className="text-gray-600">Overall Score</div>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getScoreBadgeColor(result.percentage)}`}>
                                    Grade: {getGrade(result.percentage)}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">
                                    {result.correctAnswers}/{result.totalQuestions}
                                </div>
                                <div className="text-gray-600">Correct Answers</div>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-600 mb-2">
                                    {result.timeTaken}
                                </div>
                                <div className="text-gray-600">Time Taken</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{result.correctAnswers} correct out of {result.totalQuestions}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-1000 ${result.percentage >= 80 ? 'bg-green-500' :
                                        result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${result.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                                <div className="text-sm text-green-700">Correct</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-red-600">{result.wrongAnswers}</div>
                                <div className="text-sm text-red-700">Wrong</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-600">{result.unanswered}</div>
                                <div className="text-sm text-gray-700">Unanswered</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        onClick={onRetakeTest}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                        🔄 Take Another Test
                    </button>

                    <button
                        onClick={() => setShowDetailedResults(!showDetailedResults)}
                        className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200"
                    >
                        {showDetailedResults ? '📊 Hide' : '📋 Show'} Detailed Results
                    </button>
                </div>

                {/* Detailed Results */}
                {showDetailedResults && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Detailed Results</h2>
                            <p className="text-gray-600 text-sm mt-1">Review each question and explanation</p>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {result.mcqs.map((mcq, index) => {
                                const userAnswer = result.answers[mcq.id];
                                const isCorrect = userAnswer === mcq.correctAnswer;
                                const isUnanswered = !userAnswer;

                                return (
                                    <div key={mcq.id} className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                                                    Q{index + 1}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    {isCorrect && <span className="text-green-600">✅</span>}
                                                    {!isCorrect && !isUnanswered && <span className="text-red-600">❌</span>}
                                                    {isUnanswered && <span className="text-gray-400">⭕</span>}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <span>{mcq.subject}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-1 rounded text-xs ${mcq.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    mcq.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {mcq.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                                            {mcq.question}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            {mcq.options.map((option) => (
                                                <div
                                                    key={option.label}
                                                    className={`p-3 border-2 rounded-lg ${option.label === mcq.correctAnswer
                                                        ? 'border-green-500 bg-green-50'
                                                        : userAnswer === option.label && !isCorrect
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="font-semibold text-gray-700 mr-2">
                                                        {option.label}.
                                                    </span>
                                                    <span className="text-gray-800">{option.text}</span>
                                                    {option.label === mcq.correctAnswer && (
                                                        <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                                                    )}
                                                    {userAnswer === option.label && !isCorrect && (
                                                        <span className="ml-2 text-red-600 font-semibold">✗ Your Answer</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start space-x-2">
                                                <span className="text-blue-600 font-semibold text-sm">💡</span>
                                                <div>
                                                    <span className="text-blue-800 font-semibold text-sm">Explanation:</span>
                                                    <p className="text-blue-700 text-sm mt-1">{mcq.explanation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {isUnanswered && (
                                            <div className="mt-3 bg-gray-100 border border-gray-200 rounded-lg p-3">
                                                <span className="text-gray-600 text-sm font-medium">⚠️ This question was not answered</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Performance Insights */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Performance Insights</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="text-sm text-gray-600">Accuracy Rate</div>
                            <div className="text-xl font-bold text-blue-600">
                                {result.totalQuestions > 0 ? Math.round((result.correctAnswers / (result.totalQuestions - result.unanswered)) * 100) || 0 : 0}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                of answered questions
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <div className="text-2xl mb-2">⚡</div>
                            <div className="text-sm text-gray-600">Completion Rate</div>
                            <div className="text-xl font-bold text-green-600">
                                {Math.round(((result.totalQuestions - result.unanswered) / result.totalQuestions) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                questions attempted
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                            <div className="text-2xl mb-2">⏱️</div>
                            <div className="text-sm text-gray-600">Average Time</div>
                            <div className="text-xl font-bold text-purple-600">
                                {result.totalQuestions > 0 ? Math.round((13 * 60 - parseInt(result.timeTaken.split(':')[0]) * 60 - parseInt(result.timeTaken.split(':')[1])) / result.totalQuestions) : 0}s
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                per question
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">🚀 Recommendations</h3>
                        <div className="text-sm text-gray-700 space-y-1">
                            {result.percentage >= 90 && (
                                <p>• Excellent work! You have a strong understanding of the material.</p>
                            )}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResults;