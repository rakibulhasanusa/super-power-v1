"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Calculator,
  Clock,
  Globe,
  Settings,
  Users,
  Trophy,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Target,
  Award,
  TrendingUp,
  Brain,
  Sparkles,
  Play,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Rocket,
  Shield,
  Smartphone,
  Eye,
  Heart
} from 'lucide-react';

// Animated component wrapper
import { ReactNode, HTMLAttributes } from 'react';
import { Button } from './components/ui/button';
import Link from 'next/link';

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedDiv = ({ children, className = '', delay = 0, ...props }: AnimatedDivProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const QuizHomepage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSubject, setActiveSubject] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Performance optimized mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Auto-rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Memoized data
  const subjects = useMemo(() => [
    {
      name: 'Science',
      icon: <Globe className="w-8 h-8" />,
      description: '500+ questions covering Physics, Chemistry & Biology',
      gradient: 'from-blue-500 to-purple-600',
      questionsCount: '500+',
      difficulty: 'All Levels'
    },
    {
      name: 'Mathematics',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Algebra, Geometry, Calculus & Statistics',
      gradient: 'from-emerald-500 to-teal-600',
      questionsCount: '400+',
      difficulty: 'Beginner to Advanced'
    },
    {
      name: 'History',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'World History, Ancient Civilizations & Modern Era',
      gradient: 'from-amber-500 to-red-600',
      questionsCount: '350+',
      difficulty: 'All Periods'
    },
    {
      name: 'General Knowledge',
      icon: <Brain className="w-8 h-8" />,
      description: 'Current Affairs, Geography & General Awareness',
      gradient: 'from-pink-500 to-red-600',
      questionsCount: '600+',
      difficulty: 'Updated Daily'
    },
    {
      name: 'Custom Quiz',
      icon: <Settings className="w-8 h-8" />,
      description: 'Create personalized quiz topics with AI assistance',
      gradient: 'from-indigo-500 to-pink-600',
      questionsCount: 'Unlimited',
      difficulty: 'Your Choice'
    },
    {
      name: 'Programming',
      icon: <Zap className="w-8 h-8" />,
      description: 'Python, JavaScript, Data Structures & Algorithms',
      gradient: 'from-cyan-500 to-indigo-600',
      questionsCount: '300+',
      difficulty: 'Beginner to Expert'
    }
  ], []);

  const steps = useMemo(() => [
    {
      number: '1',
      title: 'Choose Subject',
      description: 'Select from our extensive library or create custom quizzes with AI-powered question generation.',
      icon: <Target className="w-12 h-12" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '2',
      title: 'Answer 40 MCQs',
      description: 'Engage with thoughtfully crafted questions designed by education experts and AI.',
      icon: <Zap className="w-12 h-12" />,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      number: '3',
      title: 'Get Detailed Results',
      description: 'Receive comprehensive analytics, explanations, and personalized study recommendations.',
      icon: <TrendingUp className="w-12 h-12" />,
      color: 'from-purple-500 to-pink-500'
    }
  ], []);

  const leaderboard = useMemo(() => [
    { rank: 1, name: 'Alex Kumar', score: '98%', subject: 'Mathematics', avatar: '🏆', streak: 15, points: 2450 },
    { rank: 2, name: 'Sarah Chen', score: '96%', subject: 'Science', avatar: '⚗️', streak: 12, points: 2380 },
    { rank: 3, name: 'Mike Johnson', score: '94%', subject: 'History', avatar: '📚', streak: 10, points: 2290 },
    { rank: 4, name: 'Emma Davis', score: '92%', subject: 'General Knowledge', avatar: '🌟', streak: 8, points: 2150 }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: 'Rahul Sharma',
      text: 'QuizMaster transformed my study routine! The AI-generated explanations helped me understand complex concepts better than any textbook.',
      avatar: 'R',
      rating: 5,
      role: 'Engineering Student',
      improvement: '+25% improvement',
      university: 'MIT'
    },
    {
      name: 'Priya Patel',
      text: 'The adaptive difficulty and instant feedback make learning addictive. I\'ve completed over 100 quizzes in just 2 months!',
      avatar: 'P',
      rating: 5,
      role: 'Medical Student',
      improvement: '+40% improvement',
      university: 'Harvard Medical'
    },
    {
      name: 'David Wilson',
      text: 'Custom quiz creation is a game-changer. I can focus on my weak areas and track improvement over time. Absolutely brilliant!',
      avatar: 'D',
      rating: 5,
      role: 'Competitive Exam Prep',
      improvement: '+30% improvement',
      university: 'Oxford University'
    }
  ], []);

  const stats = useMemo(() => [
    { number: '50K+', label: 'Active Students', icon: <Users className="w-6 h-6" />, color: 'text-blue-400' },
    { number: '2M+', label: 'Questions Attempted', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-400' },
    { number: '95%', label: 'Success Rate', icon: <Trophy className="w-6 h-6" />, color: 'text-yellow-400' },
    { number: '24/7', label: 'Available', icon: <Clock className="w-6 h-6" />, color: 'text-purple-400' }
  ], []);

  const features = useMemo(() => [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Learning',
      description: 'Smart algorithms adapt to your learning style and pace',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Detailed Analytics',
      description: 'Track progress with comprehensive performance insights',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile Optimized',
      description: 'Learn anywhere, anytime with our responsive platform',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
      color: 'from-indigo-500 to-blue-600'
    }
  ], []);

  // Floating particles component
  const FloatingParticles = ({ count = 20 }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Custom cursor */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${activeSubject !== null ? 1.5 : 1})`
        }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl shadow-2xl z-40 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">QuizMaster</span>
                <div className="text-xs text-blue-200">AI-Powered Learning</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1" asChild>
                <Link prefetch={false} href="/mcq">Free Trial</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
              animationDelay: '1s'
            }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
              animationDelay: '2s'
            }}
          />
        </div>

        <FloatingParticles count={25} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left">
              <AnimatedDiv delay={200}>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                  <span className="text-white font-medium">AI-Powered Quiz Platform</span>
                </div>
              </AnimatedDiv>

              <AnimatedDiv delay={400}>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                  <div className="overflow-hidden">
                    <span className="block">Master Any Subject with</span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Smart Quizzes
                    </span>
                  </div>
                </h1>
              </AnimatedDiv>

              <AnimatedDiv delay={600}>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
                  40 Quick Questions, Instant AI-Powered Results! Transform your learning with personalized quizzes and detailed analytics.
                </p>
              </AnimatedDiv>

              <AnimatedDiv delay={800}>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button className="group bg-gradient-to-r h-14 from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden relative" asChild>
                    <Link prefetch={false} href="/mcq">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <Play className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />

                      <span className="relative z-10">Get Started - It&apos;s Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                    </Link>
                  </Button>
                </div>
              </AnimatedDiv>

              {/* Stats */}
              <AnimatedDiv delay={1000}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className={`flex items-center justify-center mb-2 ${stat.color} group-hover:scale-125 transition-all duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{stat.number}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </AnimatedDiv>
            </div>

            {/* Right Visual */}
            <AnimatedDiv delay={500} className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Main Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-1 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-white font-semibold flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Quiz Session</span>
                    </div>
                    <div className="text-sm text-purple-200 bg-purple-500/20 px-3 py-1 rounded-full">
                      Question 15/40
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/15 transition-all duration-300">
                      <div className="text-white text-sm mb-2 text-purple-200">Physics - Light & Optics</div>
                      <div className="text-white font-medium">What is the speed of light in vacuum?</div>
                      <div className="mt-3 bg-blue-500/20 rounded-lg p-2 text-xs text-blue-200">
                        💡 Hint: This fundamental constant is approximately 3 × 10⁸ m/s
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['299,792,458 m/s', '300,000,000 m/s', '299,800,000 m/s', '298,000,000 m/s'].map((option, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-3 text-white text-sm hover:bg-green-500/20 hover:border-green-400/50 border border-transparent transition-all duration-300 cursor-pointer group/option">
                          <span className="text-blue-300 font-medium">{String.fromCharCode(65 + i)}.</span> {option}
                          {i === 0 && <span className="ml-2 text-green-400 opacity-0 group-hover/option:opacity-100 transition-opacity">✓</span>}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-purple-300">⏱️ 45 seconds remaining</div>
                      <div className="text-xs text-green-400">🔥 12 streak</div>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Cards */}
                <div className="absolute -top-8 -right-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 animate-bounce">
                  <div className="flex items-center space-x-2 text-white">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">98% Correct!</span>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-4 shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300 animate-pulse">
                  <div className="flex items-center space-x-2 text-white">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">15 Day Streak</span>
                  </div>
                </div>

                <div className="absolute top-1/2 -left-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-2 text-white">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold text-sm">Top 5%</span>
                  </div>
                </div>
              </div>
            </AnimatedDiv>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-6 py-2 mb-6 hover:bg-blue-200 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Choose Your Path</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Explore <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Subjects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Dive deep into expertly curated content across multiple disciplines. Each subject features AI-powered adaptive learning.
            </p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <AnimatedDiv
                key={index}
                delay={index * 100}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-6 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-70 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${subject.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                      {subject.icon}
                    </div>
                    <div className="text-right opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                      <div className="text-sm text-gray-500">{subject.questionsCount}</div>
                      <div className="text-xs text-gray-400">Questions</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-all duration-300">{subject.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{subject.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                      <Target className="w-4 h-4" />
                      <span>{subject.difficulty}</span>
                    </div>
                    <button className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center space-x-2 group-hover:translate-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <span>Start Quiz</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">QuizMaster</span>
            </h2>
          </AnimatedDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedDiv
                key={index}
                delay={index * 150}
                className="group text-center p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-6 py-2 mb-6 hover:bg-purple-200 transition-all duration-300">
              <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
              <span className="text-purple-600 font-medium">Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get started in seconds with our streamlined learning process designed for maximum engagement and retention.
            </p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <AnimatedDiv key={index} delay={index * 200} className="text-center group relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-full z-0">
                    <div className="w-full h-0.5 bg-gradient-to-r from-gray-300 via-blue-400 to-transparent relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-20 h-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div className={`w-28 h-28 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">{step.number}</span>
                    </div>
                    <div className="absolute -inset-6 bg-gradient-to-r from-white to-gray-50 rounded-full -z-10 group-hover:scale-150 transition-transform duration-700 opacity-80"></div>
                  </div>

                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto -mt-20 mb-8 relative z-20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                    <div className="group-hover:animate-bounce">{step.icon}</div>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors">{step.description}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <FloatingParticles count={15} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-medium">Hall of Fame</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Top <span className="text-yellow-400 animate-pulse">Performers</span>
            </h2>
            <p className="text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Join the elite circle of top performers and showcase your knowledge mastery to the world.
            </p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedDiv className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-8 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                <span>Weekly Champions</span>
              </h3>
              <div className="space-y-6">
                {leaderboard.map((user, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer transform hover:scale-105">
                    <div className="flex items-center space-x-6">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ${user.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' :
                        user.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          user.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                            'bg-gradient-to-r from-purple-400 to-pink-500'
                        }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-lg group-hover:text-yellow-300 transition-colors">{user.name}</div>
                        <div className="text-purple-200 text-sm">{user.subject}</div>
                        <div className="text-xs text-purple-300 flex items-center space-x-1">
                          <span>🔥 {user.streak} day streak</span>
                          <span className="text-yellow-400">• {user.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">{user.score}</div>
                      <div className="text-xs text-purple-300">#{user.rank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedDiv>

            <AnimatedDiv delay={200} className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Award className="w-12 h-12 text-white mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Perfect Scores</h3>
                <div className="text-4xl font-bold text-white mb-2">247</div>
                <p className="text-emerald-100">Students achieved 100% this week</p>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <TrendingUp className="w-12 h-12 text-white mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Average Improvement</h3>
                <div className="text-4xl font-bold text-white mb-2">+32%</div>
                <p className="text-blue-100">Score increase after 30 days</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Rocket className="w-12 h-12 text-white mb-4 group-hover:animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Active Today</h3>
                <div className="text-4xl font-bold text-white mb-2">1,247</div>
                <p className="text-orange-100">Students learning right now</p>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 rounded-full px-6 py-2 mb-6 hover:bg-indigo-200 transition-all duration-300">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-medium">Success Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              What Students <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join thousands of learners who have transformed their academic journey with QuizMaster's AI-powered platform.
            </p>
          </AnimatedDiv>

          <AnimatedDiv className="mb-16">
            <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="flex items-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600 flex items-center space-x-2">
                    <span>{testimonials[currentTestimonial].role}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-600">{testimonials[currentTestimonial].university}</span>
                  </div>
                  <div className="flex text-yellow-400 mt-2">
                    {Array.from({ length: testimonials[currentTestimonial].rating }, (_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-green-600 animate-pulse">{testimonials[currentTestimonial].improvement}</div>
                  <div className="text-sm text-gray-500">Performance boost</div>
                </div>
              </div>
              <blockquote className="text-2xl text-gray-700 leading-relaxed italic relative">
                <div className="absolute -top-4 -left-2 text-6xl text-blue-200">"</div>
                {testimonials[currentTestimonial].text}
                <div className="absolute -bottom-8 -right-2 text-6xl text-blue-200">"</div>
              </blockquote>

              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </AnimatedDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedDiv
                key={index}
                delay={index * 200}
                className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer group relative overflow-hidden ${index === currentTestimonial ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
                  }`}
                onClick={() => setCurrentTestimonial(index)}
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      <div className="text-xs text-blue-500">{testimonial.university}</div>
                      <div className="flex text-yellow-400 mt-1">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">{testimonial.text}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-green-600 font-semibold">{testimonial.improvement}</div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <FloatingParticles count={20} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <Sparkles className="w-5 h-5 text-yellow-400 group-hover:animate-spin transition-all duration-300" />
            <span className="text-white font-medium">Ready to Excel?</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Start Your Learning
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Journey Today
            </span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join over 50,000 students who are already mastering their subjects with our AI-powered quiz platform.
            Your next breakthrough is just one quiz away.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="group bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-gray-900 px-12 py-6 rounded-2xl text-xl font-bold hover:from-yellow-500 hover:to-red-600 transition-all duration-500 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Play className="w-7 h-7 group-hover:scale-125 transition-transform relative z-10" />
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </button>
            <button className="group bg-white/10 backdrop-blur-sm text-white px-12 py-6 rounded-2xl text-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center space-x-3 hover:scale-105 transform">
              <BookOpen className="w-6 h-6 group-hover:animate-pulse" />
              <span>Explore Subjects</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-blue-200">
            <div className="flex items-center space-x-2 group hover:text-white transition-colors">
              <CheckCircle className="w-5 h-5 text-green-400 group-hover:animate-pulse" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2 group hover:text-white transition-colors">
              <CheckCircle className="w-5 h-5 text-green-400 group-hover:animate-pulse" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center space-x-2 group hover:text-white transition-colors">
              <CheckCircle className="w-5 h-5 text-green-400 group-hover:animate-pulse" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold group-hover:text-blue-400 transition-colors">QuizMaster</span>
                  <div className="text-sm text-blue-400">AI-Powered Learning Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Transforming education through intelligent quizzes and personalized learning experiences.
                Join millions of students worldwide in their journey to academic excellence.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-4">
                {['About Us', 'How It Works', 'Pricing', 'Blog', 'Help Center', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Support</span>
              </h3>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance', 'Accessibility', 'Report Issue'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                © 2024 QuizMaster. All rights reserved. Empowering learners worldwide.
              </p>
              <div className="flex items-center space-x-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">All systems operational</span>
                </div>
                <div className="text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  Version 2.1.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-40px) rotate(10deg);
          }
          75% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QuizHomepage;