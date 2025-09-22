"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  BookOpen,
  Clock,
  Settings,
  Users,
  Trophy,
  ArrowRight,
  Target,
  Brain,
  Play,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Shield,
  FileText,
  Upload,
  Calendar,
  Building,
  GraduationCap,
  Download,
  Briefcase,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Animated component wrapper
type AnimatedDivProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  [key: string]: any
}

const AnimatedDiv = ({ children, className = "", delay = 0, ...props }: AnimatedDivProps) => {
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

// Stats Component
const StatsSection = () => {
  const stats = [
    { number: "25K+", label: "Job Aspirants", icon: <Users className="w-5 h-5" /> },
    { number: "500+", label: "Practice Tests", icon: <FileText className="w-5 h-5" /> },
    { number: "85%", label: "Success Rate", icon: <Trophy className="w-5 h-5" /> },
    { number: "24/7", label: "Available", icon: <Clock className="w-5 h-5" /> },
  ]

  return (
    <AnimatedDiv delay={1000}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="text-center group cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2 text-primary group-hover:scale-125 transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {stat.number}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedDiv>
  )
}

// Job Categories Component
const JobCategories = () => {
  const categories = [
    {
      name: "BCS (Bangladesh Civil Service)",
      icon: <Building className="w-8 h-8" />,
      description: "Complete preparation for all BCS cadre positions",
      questionsCount: "2000+",
      difficulty: "All Cadres",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      name: "Bank Job Preparation",
      icon: <Briefcase className="w-8 h-8" />,
      description: "Commercial banks, BB, and specialized bank exams",
      questionsCount: "1500+",
      difficulty: "Officer to Executive",
      gradient: "from-primary to-cyan-600",
    },
    {
      name: "Primary Teacher (DPE)",
      icon: <GraduationCap className="w-8 h-8" />,
      description: "Primary Assistant Teacher recruitment preparation",
      questionsCount: "1200+",
      difficulty: "All Districts",
      gradient: "from-secondary to-emerald-600",
    },
    {
      name: "Government Jobs",
      icon: <Map className="w-8 h-8" />,
      description: "Various ministry and department job preparations",
      questionsCount: "1800+",
      difficulty: "All Grades",
      gradient: "from-orange-600 to-red-600",
    },
    {
      name: "University Admission",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Public university admission test preparation",
      questionsCount: "1000+",
      difficulty: "All Units",
      gradient: "from-primary to-blue-600",
    },
    {
      name: "Custom Practice",
      icon: <Settings className="w-8 h-8" />,
      description: "Create personalized tests for any job exam",
      questionsCount: "Unlimited",
      difficulty: "Your Choice",
      gradient: "from-gray-600 to-slate-600",
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedDiv className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Job <span className="text-primary">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive preparation materials for all major job sectors in Bangladesh
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedDiv key={index} delay={index * 100}>
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}
                    >
                      {category.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.questionsCount} Questions
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">{category.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{category.difficulty}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 group-hover:translate-x-1 transition-all duration-300"
                    >
                      Start Practice
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Component
const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Choose Exam Type",
      description:
        "Select your target job exam from our comprehensive list of government and private sector positions.",
      icon: <Target className="w-10 h-10" />,
      color: "from-primary to-cyan-600",
    },
    {
      number: "2",
      title: "Take Practice Tests",
      description: "Answer MCQs in real exam conditions with time limits and proper question patterns.",
      icon: <Clock className="w-10 h-10" />,
      color: "from-secondary to-emerald-600",
    },
    {
      number: "3",
      title: "Analyze Results",
      description: "Get detailed performance analysis, correct answers, and improvement suggestions.",
      icon: <BarChart3 className="w-10 h-10" />,
      color: "from-purple-600 to-pink-600",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedDiv className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Simple and effective process to prepare for your dream job
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <AnimatedDiv key={index} delay={index * 200} className="text-center group relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full z-0">
                  <div className="w-full h-px bg-border relative">
                    <div className="absolute inset-0 bg-primary w-0 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}
                >
                  {step.number}
                </div>

                <div
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white mx-auto -mt-14 mb-6 relative z-20 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Component
const Features = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real Exam Simulation",
      description: "Practice with actual time limits and exam patterns used in job tests",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analysis",
      description: "Track your progress with detailed analytics and weak area identification",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Updated Question Bank",
      description: "Questions based on latest job exam patterns and syllabus",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Safe and reliable platform for uninterrupted practice sessions",
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedDiv className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose <span className="text-primary">JobPrep BD</span>
          </h2>
        </AnimatedDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedDiv key={index} delay={index * 150}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-cyan-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg mb-3">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

// Upcoming Features Component
const UpcomingFeatures = () => {
  const upcomingFeatures = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "PDF Upload & Practice",
      description: "Upload your study materials and generate custom MCQs automatically",
      status: "Coming Soon",
      eta: "Next Month",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Question Generator",
      description: "Generate unlimited practice questions on any topic using AI",
      status: "In Development",
      eta: "2 Months",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Live Mock Tests",
      description: "Participate in scheduled mock tests with other candidates",
      status: "Planning",
      eta: "3 Months",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Offline Mode",
      description: "Download question sets and practice without internet connection",
      status: "Research",
      eta: "4 Months",
    },
  ]

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedDiv className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            What's Next
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Upcoming <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Exciting new features coming to enhance your job preparation experience
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {upcomingFeatures.map((feature, index) => (
            <AnimatedDiv key={index} delay={index * 150}>
              <Card className="hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-emerald-500">
                  {feature.status}
                </Badge>
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-r from-primary to-cyan-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed mb-4">{feature.description}</CardDescription>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">ETA: {feature.eta}</span>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedDiv>
          ))}
        </div>

        <AnimatedDiv delay={600} className="text-center mt-12">
          <Card className="inline-block">
            <CardContent className="flex items-center space-x-2 p-4">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <span className="font-medium">Have suggestions? We'd love to hear from you!</span>
            </CardContent>
          </Card>
        </AnimatedDiv>
      </div>
    </section>
  )
}

// Main Homepage Component
const JobPrepHomepage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              <AnimatedDiv delay={200}>
                <Badge
                  variant="secondary"
                  className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Bangladesh Job Preparation Platform
                </Badge>
              </AnimatedDiv>

              <AnimatedDiv delay={400}>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                  <span className="block">Ace Your</span>
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Dream Job Exam
                  </span>
                </h1>
              </AnimatedDiv>

              <AnimatedDiv delay={600}>
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed text-pretty">
                  Comprehensive MCQ practice for BCS, Bank Jobs, Government positions, and University admissions.
                  Prepare with real exam patterns and get instant results.
                </p>
              </AnimatedDiv>

              <AnimatedDiv delay={800}>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-primary/25 transform hover:-translate-y-1"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Free Practice
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    Browse Categories
                  </Button>
                </div>
              </AnimatedDiv>

              <StatsSection />
            </div>

            {/* Right Visual */}
            <AnimatedDiv delay={500} className="relative">
              <div className="relative w-full h-96">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                        <CardTitle className="text-white">BCS Preliminary Mock Test</CardTitle>
                      </div>
                      <Badge className="bg-primary/30 text-white">Question 15/200</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="bg-white/10">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="text-primary/80 border-primary/30 mb-2">
                          General Knowledge - Bangladesh
                        </Badge>
                        <p className="font-medium text-white">What is the area of Bangladesh?</p>
                      </CardContent>
                    </Card>
                    <div className="space-y-2">
                      {["1,47,570 sq km", "1,48,460 sq km", "1,45,570 sq km", "1,50,000 sq km"].map((option, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          className="w-full justify-start bg-white/5 text-white hover:bg-secondary/20 border border-transparent hover:border-secondary/50"
                        >
                          <span className="text-primary font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-purple-300">⏱️ 2:30 remaining</div>
                      <div className="text-secondary">🎯 85% accuracy</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <JobCategories />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Upcoming Features Section */}
      <UpcomingFeatures />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedDiv>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Start Your
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Success Journey?
              </span>
            </h2>

            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto text-pretty">
              Join thousands of successful candidates who achieved their dream jobs through our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 shadow-xl transform hover:-translate-y-1"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Question Bank
              </Button>
            </div>
          </AnimatedDiv>
        </div>
      </section>
    </div>
  )
}

export default JobPrepHomepage
