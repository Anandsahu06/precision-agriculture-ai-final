"use client"

import { MetricCards } from "@/components/dashboard/metric-cards"
import { NdviHeatmap } from "@/components/dashboard/ndvi-heatmap"
import { NdviChart } from "@/components/dashboard/ndvi-chart"
import { WeatherForecast } from "@/components/dashboard/weather-forecast"
import { Footer } from "@/components/footer"
import { useAnalysis } from "@/lib/analysis-context"

export default function DashboardPage() {
  const { result } = useAnalysis()

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Crop Health Dashboard
          </h1>
          <p className="text-muted-foreground" suppressHydrationWarning>
            {result
              ? `Last analysis: ${new Date(result.timestamp).toLocaleString()} - ${result.imageName}`
              : "No analysis results yet. Upload an image to get started."}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <MetricCards />

          <div className="grid gap-8 lg:grid-cols-2">
            <NdviHeatmap />
            <div className="flex flex-col gap-8">
              <WeatherForecast />
              <NdviChart />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
