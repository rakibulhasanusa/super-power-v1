"use client"

import { useState, useEffect, useCallback } from "react"

export function useTimer(totalMinutes: number) {
    const [timeLeft, setTimeLeft] = useState(totalMinutes * 60) // Convert to seconds
    const [isRunning, setIsRunning] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)
    const [startTime, setStartTime] = useState<number | null>(null)

    const startTimer = useCallback(() => {
        setIsRunning(true)
        setStartTime(Date.now())
    }, [])

    const stopTimer = useCallback(() => {
        setIsRunning(false)
    }, [])

    const resetTimer = useCallback(() => {
        setTimeLeft(totalMinutes * 60)
        setIsRunning(false)
        setHasEnded(false)
        setStartTime(null)
    }, [totalMinutes])

    const formatTime = useCallback(() => {
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }, [timeLeft])

    const getElapsedTime = useCallback(() => {
        if (!startTime) return "00:00"
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }, [startTime])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        setHasEnded(true)
                        setIsRunning(false)
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, timeLeft])

    return {
        timeLeft,
        isRunning,
        hasEnded,
        startTimer,
        stopTimer,
        resetTimer,
        formatTime,
        getElapsedTime,
    }
}
