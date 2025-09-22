import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Shield, TrendingUp, Users, Rocket } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    description:
      "Get deep insights into your business performance with advanced machine learning algorithms that identify trends and opportunities.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Automation",
    description:
      "Automate repetitive tasks and workflows to save time and reduce human error, allowing your team to focus on strategic initiatives.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, ensuring your sensitive business data is always protected and compliant.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Growth",
    description:
      "Our platform grows with your business, handling increased workloads and complexity without compromising performance.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamless collaboration tools that keep your team aligned and productive, with real-time updates and shared workspaces.",
  },
  {
    icon: Rocket,
    title: "Rapid Deployment",
    description:
      "Get up and running in minutes, not months. Our streamlined onboarding process ensures quick time-to-value.",
  },
]

export function FeaturesSection() {
  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover the key features that make our AI platform the perfect choice for forward-thinking startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
