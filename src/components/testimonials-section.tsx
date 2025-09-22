"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    content:
      "This AI platform transformed our operations completely. We've seen a 300% increase in productivity and our team loves the intuitive interface.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO, InnovateLab",
    content:
      "The automation capabilities are incredible. What used to take our team hours now happens in minutes. It's like having a superpower for our startup.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emily Watson",
    role: "Founder, GrowthHack",
    content:
      "The insights we get from the AI analytics have been game-changing. We can now make data-driven decisions that actually move the needle.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Don't just take our word for it. Here's what startup leaders are saying about our platform.
          </p>
        </div>

        <div className="relative">
          <Card className="bg-card shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl sm:text-2xl text-card-foreground text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-center">
                  <div className="font-semibold text-card-foreground">{testimonials[currentIndex].name}</div>
                  <div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
