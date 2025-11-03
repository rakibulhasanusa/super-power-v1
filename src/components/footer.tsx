import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Lightbulb, Shield, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <Link href={'/'}>
                  <span className="text-2xl font-bold text-foreground">JobPreAI</span>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    AI-Powered Learning
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      Beta
                    </Badge>
                  </div>
                </Link>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed text-pretty">
              Empowering Bangladeshi job seekers with comprehensive preparation for BCS, bank jobs, government
              positions, and university admissions through AI-powered learning.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-primary flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-4">
              {[
                "BCS Preparation",
                "Bank Jobs",
                "Primary Teacher",
                "University Admission",
                "Mock Tests",
                "Study Materials",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-primary flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Support</span>
            </h3>
            <ul className="space-y-4">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "FAQ", "Report Issue"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-balance">
              © 2025 JobPreAI. Built by <Link href={"https://rakibulhasan-dev.vercel.app"} className="underline hover:text-foreground">Rakibul Hasan</Link>
            </p>
            <div className="flex items-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">All systems operational</span>
              </div>
              <Badge variant="outline" className="text-sm">
                Version 1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
