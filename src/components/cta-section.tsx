import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-accent text-accent-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
          Ready to Transform Your Startup?
        </h2>
        <p className="text-xl mb-8 opacity-90 text-pretty">
          Join thousands of successful startups who have already revolutionized their operations with our AI platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Cancel anytime</span>
          </div>
        </div>

        <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-semibold">
          Start Your Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
