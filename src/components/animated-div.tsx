"use client";

import { useEffect, useRef, useState } from "react"
// Animated component wrapper
type AnimatedDivProps = {
    children: React.ReactNode
    className?: string
    delay?: number
    [key: string]: any
}

export const AnimatedDiv = ({ children, className = "", delay = 0, ...props }: AnimatedDivProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay)
                }
            },
            { threshold: 0.1 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [delay])

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}