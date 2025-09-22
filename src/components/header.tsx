import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-sm z-40 transition-all duration-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">JobPrep BD</span>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                AI-Powered Learning
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  Beta
                </Badge>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
            <Button
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1"
              asChild
            >
              <Link prefetch={false} href="/mcq">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
