'use client';
import React, { useState } from 'react';
import TestSetup from '@/app/components/TestSetup';
import TestInterface from '@/app/components/TestInterface';
import TestResults from '@/app/components/TestResults';
import { MCQ, TestResult } from '@/types/mcq';

type AppState = 'setup' | 'testing' | 'results';

export default function Home() {
    const [appState, setAppState] = useState<AppState>('setup');
    const [mcqs, setMCQs] = useState<MCQ[]>([]);
    const [testResult, setTestResult] = useState<TestResult | null>(null);

    const handleStartTest = (generatedMCQs: MCQ[]) => {
        setMCQs(generatedMCQs);
        setAppState('testing');
    };

    const handleTestComplete = (result: TestResult) => {
        setTestResult(result);
        setAppState('results');
    };

    const handleRetakeTest = () => {
        setMCQs([]);
        setTestResult(null);
        setAppState('setup');
    };

    const handleBackToSetup = () => {
        setAppState('setup');
    };

    return (
        <>
            {appState === 'setup' && (
                <TestSetup onStartTest={handleStartTest} />
            )}

            {appState === 'testing' && (
                <TestInterface
                    mcqs={mcqs}
                    onTestComplete={handleTestComplete}
                    onBackToSetup={handleBackToSetup}
                />
            )}

            {appState === 'results' && testResult && (
                <TestResults
                    result={testResult}
                    onRetakeTest={handleRetakeTest}
                />
            )}
        </>
    );
}