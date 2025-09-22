'use client';
import React, { useState } from 'react';
import { MCQ } from '@/types/mcq';

interface TestSetupProps {
    onStartTest: (mcqs: MCQ[]) => void;
}

const TestSetup: React.FC<TestSetupProps> = ({ onStartTest }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        count: 5,
        subject: 'Mathematics',
        topic: '',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard'
    });

    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'History', 'Geography', 'Literature', 'Computer Science', "Accounting",
    ];

    const handleStartTest = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate-mcq-one', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                onStartTest(data.mcqs);
            }
        } catch (error) {
            console.log({ error });
            console.error('Failed to generate test:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">📝 MCQ Test</h1>
                    <p className="text-lg text-gray-600">
                        Take a timed multiple choice test with 1 minute per question
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test Configuration</h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Questions
                                </label>
                                <select
                                    value={formData.count}
                                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value={5}>5 Questions</option>
                                    <option value={10}>10 Questions</option>
                                    <option value={15}>15 Questions</option>
                                    <option value={20}>20 Questions</option>
                                    <option value={25}>25 Questions</option>
                                    <option value={30}>30 Questions</option>
                                    <option value={40}>40 Questions</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topic (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Calculus, World War II"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty Level
                                </label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as typeof formData.difficulty })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="text-amber-600 mr-3">⏰</div>
                                <div>
                                    <p className="font-semibold text-amber-800">Test Duration: {formData.count} Minutes</p>
                                    <p className="text-sm text-amber-700">
                                        The test will automatically submit when time expires. Make sure you have a stable internet connection.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartTest}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Test...
                                </span>
                            ) : (
                                `🚀 Start ${formData.count} Question Test`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSetup;
