"use client"

import {
  Bug,
  Droplets,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const INSIGHTS = [
  {
    id: 1,
    title: "Pest Infestation Detected",
    description:
      "AI models identified patterns consistent with aphid activity in the northeast quadrant of Field B. Spectral anomalies in the red-edge band suggest leaf damage affecting approximately 2.3 hectares.",
    severity: "High" as const,
    icon: Bug,
    zone: "Field B - NE Quadrant",
    confidence: 94.2,
    recommendations: [
      "Deploy targeted insecticide application within 48 hours",
      "Increase monitoring frequency for adjacent zones",
      "Consider introducing beneficial predatory insects as biological control",
      "Schedule follow-up drone scan in 5 days to assess treatment efficacy",
    ],
  },
  {
    id: 2,
    title: "Nutrient Deficiency Detected",
    description:
      "Chlorophyll content analysis reveals nitrogen deficiency in the southern sections of Field A. GNDVI values consistently below 0.35 across 4.1 hectares, indicating insufficient nutrient uptake during the vegetative growth stage.",
    severity: "Medium" as const,
    icon: Leaf,
    zone: "Field A - South Section",
    confidence: 89.5,
    recommendations: [
      "Apply nitrogen-rich fertilizer at 45 kg/ha rate",
      "Test soil samples from affected zone for pH imbalance",
      "Adjust fertigation schedule to increase nitrogen delivery",
      "Monitor GNDVI values over next 2 weeks for improvement",
    ],
  },
  {
    id: 3,
    title: "Irrigation Imbalance Detected",
    description:
      "Thermal analysis shows uneven moisture distribution across Field C. Western portions exhibit water stress (CWSI > 0.6), while the eastern edge shows potential waterlogging. This suggests a malfunctioning drip line or pressure inconsistency.",
    severity: "Medium" as const,
    icon: Droplets,
    zone: "Field C - Full Coverage",
    confidence: 87.8,
    recommendations: [
      "Inspect drip irrigation lines in western section for blockages",
      "Check pressure regulators and flow rates at zone valves",
      "Reduce irrigation duration for eastern edge by 20%",
      "Install additional soil moisture sensors for continuous monitoring",
    ],
  },
  {
    id: 4,
    title: "Early Blight Risk Warning",
    description:
      "Environmental conditions combined with canopy density analysis indicate elevated risk for early blight development. Humidity levels and leaf wetness patterns in Field D match historical outbreak profiles.",
    severity: "Low" as const,
    icon: TrendingDown,
    zone: "Field D - Central Area",
    confidence: 78.3,
    recommendations: [
      "Apply preventive fungicide within the next 7 days",
      "Improve air circulation by adjusting row spacing if possible",
      "Monitor weather forecasts for prolonged humidity events",
      "Increase scan frequency to bi-weekly for early detection",
    ],
  },
]

const SEVERITY_CONFIG = {
  High: {
    color: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
  Medium: {
    color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  Low: {
    color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
}

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/api"
import { useAnalysis } from "@/lib/analysis-context"

export default function InsightsPage() {
  const { result } = useAnalysis()
  const [globalInsights, setGlobalInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        setGlobalInsights(res.global_insights || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch global insights", err)
        setLoading(false)
      })
  }, [])

  // Combine static examples with real-time analysis results
  const currentInsights = result?.insights || []
  const allInsights = [...currentInsights, ...globalInsights]

  if (loading && !result) {
    return <div className="flex h-screen items-center justify-center">Loading AI Insights...</div>
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AI Insights & Recommendations
          </h1>
          <p className="text-muted-foreground">
            {allInsights.length > 0
              ? "Machine learning models have identified conditions requiring attention based on your latest field scans."
              : "No critical issues detected. Your fields are showing optimal growth patterns."}
          </p>
        </div>

        {/* Summary Bar */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {(["High", "Medium", "Low"] as const).map((level) => {
            const count = allInsights.filter((i: any) => i.severity === level).length
            const config = SEVERITY_CONFIG[level]
            return (
              <Card key={level} className="border-border/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.color)}>
                    <config.icon className={cn("h-5 w-5", config.iconColor)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">{level} Severity</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Insight Cards */}
        <div className="flex flex-col gap-6">
          {allInsights.length === 0 && (
            <Card className="border-border/60 bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Everything looks great!</h3>
                <p className="text-muted-foreground">Continue monitoring your fields for any changes.</p>
              </CardContent>
            </Card>
          )}

          {allInsights.map((insight: any, idx: number) => {
            const config = SEVERITY_CONFIG[insight.severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.Low
            const Icon = insight.icon === "Bug" ? Bug :
              insight.icon === "Droplets" ? Droplets :
                insight.icon === "AlertTriangle" ? AlertTriangle :
                  Leaf

            return (
              <Card key={idx} className="border-border/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="flex flex-row items-start gap-4 pb-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", config.color)}>
                    <Icon className={cn("h-5 w-5", config.iconColor)} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <Badge className={cn("text-xs", config.color)}>
                        {insight.severity}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Zone: {insight.zone || "Analyzed Field"}</span>
                      <span>Confidence: {insight.confidence || 95}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {insight.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      Recommended Actions
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {insight.recommendations.map((rec: string) => (
                        <li key={rec} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}
