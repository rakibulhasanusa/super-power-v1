"use client"
import { useState, useEffect, useCallback } from "react"

export const useTimer = (initialMinutes = 13) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)

    const startTimer = useCallback(() => {
        setIsRunning(true)
        setHasEnded(false)
    }, [])

    const stopTimer = useCallback(() => {
        setIsRunning(false)
    }, [])

    const resetTimer = useCallback(() => {
        setTimeLeft(initialMinutes * 60)
        setIsRunning(false)
        setHasEnded(false)
    }, [initialMinutes])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false)
                        setHasEnded(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isRunning, timeLeft])

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }, [])

    return {
        timeLeft,
        isRunning,
        hasEnded,
        startTimer,
        stopTimer,
        resetTimer,
        formatTime: () => formatTime(timeLeft),
        getElapsedTime: () => formatTime(initialMinutes * 60 - timeLeft),
    }
}
