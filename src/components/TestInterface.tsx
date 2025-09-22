'use client';
import React, { useState, useEffect } from 'react';
import { MCQ, TestResult } from '@/types/mcq';
import { useTimer } from '@/hooks/useTimer';

interface TestInterfaceProps {
    mcqs: MCQ[];
    onTestComplete: (result: TestResult) => void;
    onBackToSetup: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ mcqs, onTestComplete, onBackToSetup }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const timer = useTimer(mcqs.length); // 1 minute per question

    useEffect(() => {
        timer.startTimer();
    }, []);

    useEffect(() => {
        if (timer.hasEnded) {
            handleSubmitTest();
        }
    }, [timer.hasEnded]);

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmitTest = () => {
        timer.stopTimer();

        const correctAnswers = mcqs.filter(mcq => answers[mcq.id] === mcq.correctAnswer).length;
        const wrongAnswers = mcqs.filter(mcq => answers[mcq.id] && answers[mcq.id] !== mcq.correctAnswer).length;
        const unanswered = mcqs.length - Object.keys(answers).length;

        const result: TestResult = {
            totalQuestions: mcqs.length,
            correctAnswers,
            wrongAnswers,
            unanswered,
            score: correctAnswers,
            percentage: Math.round((correctAnswers / mcqs.length) * 100),
            timeTaken: timer.getElapsedTime(),
            answers,
            mcqs
        };

        onTestComplete(result);
    };

    const getAnsweredCount = () => Object.keys(answers).length;

    const navigateToQuestion = (index: number) => {
        setCurrentQuestion(index);
    };

    const currentMCQ = mcqs[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Timer */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-semibold text-gray-800">MCQ Test</h1>
                            <div className="text-sm text-gray-600">
                                Question {currentQuestion + 1} of {mcqs.length}
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-sm text-gray-600">
                                Answered: {getAnsweredCount()}/{mcqs.length}
                            </div>

                            <div className={`px-4 py-2 rounded-lg font-mono text-lg font-semibold ${timer.timeLeft <= 120 ? 'bg-red-100 text-red-600' :
                                timer.timeLeft <= 300 ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                ⏱️ {timer.formatTime()}
                            </div>

                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Questions</h3>
                            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                                {mcqs.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigateToQuestion(index)}
                                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentQuestion === index
                                            ? 'bg-indigo-600 text-white'
                                            : answers[mcqs[index].id]
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Current Question */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Question {currentQuestion + 1}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${currentMCQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                            currentMCQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {currentMCQ.difficulty.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {currentMCQ.subject} • {currentMCQ.topic}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-800 text-lg leading-relaxed">
                                    {currentMCQ.question}
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {currentMCQ.options.map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => handleAnswerSelect(currentMCQ.id, option.label)}
                                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${answers[currentMCQ.id] === option.label
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="font-semibold text-gray-700 mr-3">
                                            {option.label}.
                                        </span>
                                        <span className="text-gray-800">{option.text}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => navigateToQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Previous
                                </button>

                                <button
                                    onClick={() => navigateToQuestion(Math.min(mcqs.length - 1, currentQuestion + 1))}
                                    disabled={currentQuestion === mcqs.length - 1}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Submit Test?</h3>
                        <p className="text-gray-600 mb-6">
                            You have answered {getAnsweredCount()} out of {mcqs.length} questions.
                            {getAnsweredCount() < mcqs.length && ' Unanswered questions will be marked as incorrect.'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitTest}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestInterface;