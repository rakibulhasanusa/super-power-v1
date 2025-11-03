import { AnimatedDiv } from '@/components/animated-div'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Briefcase, Building, ChevronRight, GraduationCap, Map, Settings, Target } from 'lucide-react'
import Link from 'next/link'

export default function page() {
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
        <section className="py-10 bg-muted">
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
                                            <Link className="flex items-center" href={"/mcq"} >
                                                Start Practice
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
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