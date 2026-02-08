"use client"

import { AlertTriangle, CheckCircle2, Sprout, Zap, Eye, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const PROBLEMS = [
  "Manual field inspections miss early crop stress signs",
  "Delayed pest and disease detection reduces yields by 20-40%",
  "Unoptimized irrigation wastes water and increases costs",
]

const FEATURES = [
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description: "Continuous drone-based surveillance captures multispectral imagery across your entire operation.",
  },
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description: "Deep learning models detect crop stress, pest outbreaks, and nutrient deficiencies within minutes.",
  },
  {
    icon: Sprout,
    title: "Actionable Insights",
    description: "Get specific recommendations for irrigation, fertilization, and pest management tailored to each zone.",
  },
  {
    icon: Shield,
    title: "Early Warning System",
    description: "Proactive alerts when anomalies are detected, allowing intervention before crop loss occurs.",
  },
]

export function ProblemSolution() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          The Challenge of Modern Farming
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Traditional methods can't keep up with the scale and speed needed for optimal crop management.
        </p>
      </div>

      {/* Problems */}
      <div className="mb-16 flex flex-col gap-3">
        {PROBLEMS.map((problem) => (
          <div
            key={problem}
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-5 py-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <span className="text-sm text-foreground">{problem}</span>
          </div>
        ))}
      </div>

      {/* Solution Arrow */}
      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Our Solution</h3>
        <p className="max-w-xl text-muted-foreground">
          AgriVision combines drone technology with artificial intelligence to transform
          how you monitor and manage your crops.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="group border-border/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="flex gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-card-foreground">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
