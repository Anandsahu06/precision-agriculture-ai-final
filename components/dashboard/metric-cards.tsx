"use client"

import { Activity, Percent, AlertTriangle, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import { useAnalysis } from "@/lib/analysis-context"
import { cn } from "@/lib/utils"

export function MetricCards() {
  const { result } = useAnalysis()

  if (!result) return null

  const severityColor = {
    Low: "text-emerald-500",
    Medium: "text-amber-500",
    High: "text-destructive",
  }

  const metrics = [
    {
      label: "Average NDVI",
      value: result.ndvi,
      decimals: 2,
      icon: Activity,
      description: "Vegetation health index (-1 to +1)",
      color: "text-chart-1",
    },
    {
      label: "Affected Area",
      value: result.affectedArea,
      suffix: "%",
      decimals: 1,
      icon: Percent,
      description: "Crop area showing anomalies",
      color: "text-accent",
    },
    {
      label: "Severity Level",
      value: null,
      displayValue: result.severity,
      icon: AlertTriangle,
      description: "Overall threat assessment",
      color: severityColor[result.severity],
    },
    {
      label: "AI Confidence",
      value: result.confidence,
      suffix: "%",
      decimals: 1,
      icon: Brain,
      description: "Model prediction confidence",
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="border-border/60 transition-all hover:shadow-md hover:shadow-primary/5"
        >
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </span>
              <metric.icon className={cn("h-4 w-4", metric.color)} />
            </div>
            <div className="flex items-baseline gap-1">
              {metric.value !== null ? (
                <span className={cn("font-mono text-3xl font-bold", metric.color)}>
                  <AnimatedCounter
                    end={metric.value}
                    decimals={metric.decimals ?? 0}
                    suffix={metric.suffix ?? ""}
                    duration={1500}
                  />
                </span>
              ) : (
                <span className={cn("font-mono text-3xl font-bold", metric.color)}>
                  {metric.displayValue}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
