"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalysis } from "@/lib/analysis-context"

const LEGEND_ITEMS = [
  { color: "#d73027", label: "Bare Soil / Dead", range: "-1.0 to 0.0" },
  { color: "#fc8d59", label: "Very Low Health", range: "0.0 to 0.2" },
  { color: "#fee08b", label: "Low Health", range: "0.2 to 0.4" },
  { color: "#d9ef8b", label: "Moderate Health", range: "0.4 to 0.6" },
  { color: "#91cf60", label: "Good Health", range: "0.6 to 0.8" },
  { color: "#1a9850", label: "Excellent Health", range: "0.8 to 1.0" },
]

import { BACKEND_URL } from "@/lib/api"

export function NdviHeatmap() {
  const { result } = useAnalysis()
  const [zoom, setZoom] = useState(false)

  const ndviSrc = result?.heatmapUrl
    ? (result.heatmapUrl.startsWith('http') ? result.heatmapUrl : `${BACKEND_URL}${result.heatmapUrl}`)
    : "/images/ndvi-heatmap.jpg"

  const rgbSrc = result?.rgbUrl
    ? (result.rgbUrl.startsWith('http') ? result.rgbUrl : `${BACKEND_URL}${result.rgbUrl}`)
    : "/images/rgb-field.jpg"

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">Field Imagery</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Tabs defaultValue="ndvi" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="ndvi">NDVI Heatmap</TabsTrigger>
            <TabsTrigger value="rgb">Original RGB</TabsTrigger>
          </TabsList>
          <TabsContent value="ndvi">
            <div
              className="relative cursor-zoom-in overflow-hidden rounded-lg"
              onClick={() => setZoom(!zoom)}
              role="button"
              tabIndex={0}
              aria-label="Toggle zoom on NDVI heatmap"
              onKeyDown={(e) => e.key === "Enter" && setZoom(!zoom)}
            >
              <Image
                src={ndviSrc}
                alt="NDVI heatmap showing crop health across the field"
                width={800}
                height={500}
                priority
                className={`w-full rounded-lg object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}
              />
            </div>
          </TabsContent>
          <TabsContent value="rgb">
            <div
              className="relative cursor-zoom-in overflow-hidden rounded-lg"
              onClick={() => setZoom(!zoom)}
              role="button"
              tabIndex={0}
              aria-label="Toggle zoom on RGB image"
              onKeyDown={(e) => e.key === "Enter" && setZoom(!zoom)}
            >
              <Image
                src={rgbSrc}
                alt="RGB aerial view of the agricultural field"
                width={800}
                height={500}
                className={`w-full rounded-lg object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* NDVI Legend */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">NDVI Color Legend</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 shrink-0 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">{item.range}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
