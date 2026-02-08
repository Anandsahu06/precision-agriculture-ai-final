"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ImageUploader } from "@/components/analyze/image-uploader"
import { AnalysisRunner } from "@/components/analyze/analysis-runner"
import { Footer } from "@/components/footer"
import { useAnalysis } from "@/lib/analysis-context"
import { BACKEND_URL } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Navigation, Satellite as SatelliteIcon } from "lucide-react"

const STAGES = [
  "Preprocessing satellite image...",
  "Extracting spectral bands...",
  "Computing NDVI values...",
  "Running CNN classification...",
  "Generating crop health map...",
  "Compiling insights...",
]

function AnalyzeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { result, setResult, setIsAnalyzing: setGlobalAnalyzing } = useAnalysis()

  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const [location, setLocation] = useState({
    lat: result?.lat || 34.05,
    lon: result?.lon || -118.24
  })
  const [locationText, setLocationText] = useState(
    result?.lat ? `${result.lat.toFixed(4)}, ${result.lon?.toFixed(4)}` : "Los Angeles, CA"
  )
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleImageSelect = useCallback((_file: File, previewUrl: string) => {
    setPreview(previewUrl)
    setFileName(_file.name)
    setIsComplete(false)
  }, [])

  const handleClear = useCallback(() => {
    setPreview(null)
    setFileName("")
    setIsComplete(false)
    setProgress(0)
    setStage("")
  }, [])

  const handleGetLocation = () => {
    setIsGettingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsGettingLocation(false)
        }
      )
    } else {
      setIsGettingLocation(false)
    }
  }

  const runAnalysis = useCallback(async (customPreview?: string) => {
    const activePreview = customPreview || preview
    if (!activePreview) return

    setIsAnalyzing(true)
    setGlobalAnalyzing(true)
    setProgress(0)
    setIsComplete(false)

    let current = 0
    const interval = setInterval(() => {
      if (current < STAGES.length - 1) {
        setStage(STAGES[current])
        setProgress(((current + 1) / STAGES.length) * 100)
        current++
      }
    }, 500)

    try {
      const response = await fetch(activePreview)
      const blob = await response.blob()
      const file = new File([blob], fileName || "satellite_capture.jpg", { type: "image/jpeg" })

      const { analyzeImage } = await import("@/lib/api")
      const resultData = await analyzeImage(file)

      clearInterval(interval)
      setStage("Analysis complete!")
      setProgress(100)
      setIsAnalyzing(false)
      setGlobalAnalyzing(false)
      setIsComplete(true)

      const finalResult = {
        ...resultData,
        lat: location.lat,
        lon: location.lon
      }
      setResult(finalResult)

      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error) {
      console.error("Analysis failed:", error)
      clearInterval(interval)
      setIsAnalyzing(false)
      setGlobalAnalyzing(false)
      setStage("Analysis failed. Please check backend connection.")
    }
  }, [fileName, preview, router, setResult, setGlobalAnalyzing, location])

  // EFFECT: Sync local state when context result changes (for satellite -> analyze transition)
  useEffect(() => {
    if (result?.lat && result?.lon) {
      setLocation({ lat: result.lat, lon: result.lon })
    }
    if (result?.rgbUrl) {
      const fullUrl = result.rgbUrl.startsWith('http')
        ? result.rgbUrl
        : `${BACKEND_URL}${result.rgbUrl}`
      setPreview(fullUrl)
      setFileName(result.imageName || "satellite_capture.jpg")
    }
  }, [result])

  // EFFECT: Handle auto-start from Satellite page
  useEffect(() => {
    const autoStart = searchParams.get("autoStart")
    if (autoStart === "true" && result?.rgbUrl && !isAnalyzing && !isComplete) {
      // Start analysis automatically
      runAnalysis(result.rgbUrl)
    }
  }, [searchParams, result?.rgbUrl, runAnalysis, isAnalyzing, isComplete])

  // Sync text whenever coordinates change
  useEffect(() => {
    setLocationText(`${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`)
  }, [location])

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Field Intelligence Analysis
        </h1>
        <p className="text-muted-foreground">
          {searchParams.get("autoStart")
            ? "Processing your satellite capture with AI..."
            : "Upload an image or use satellite capture to generate NDVI insights."}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {result?.metadata && (
          <Card className="border-sky-500/20 bg-sky-500/5 animate-in fade-in slide-in-from-top-4">
            <CardContent className="p-4 flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <SatelliteIcon className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-sky-600/70 tracking-tighter">Active Orbital Sync</h4>
                  <p className="text-sm font-mono font-bold">{result.metadata.sensor} Full Scan</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Cloud Cover</p>
                  <p className="text-xs font-bold uppercase">{result.metadata.cloudCover}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Resolution</p>
                  <p className="text-xs font-bold uppercase">{result.metadata.resolution}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase">Data Format</p>
                  <p className="text-xs font-bold uppercase">16-bit GeoTIFF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Field Location
            </CardTitle>
            <CardDescription>
              Verified coordinates for pixel-perfect health prediction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter location (e.g. 34.05, -118.24)"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="pl-9"
                />
                <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? "Locating..." : "Auto-Locate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <ImageUploader
          onImageSelect={handleImageSelect}
          preview={preview}
          onClear={handleClear}
        />
        <AnalysisRunner
          hasImage={!!preview}
          isAnalyzing={isAnalyzing}
          progress={progress}
          stage={stage}
          isComplete={isComplete}
          onRun={() => runAnalysis()}
        />
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <>
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading AI Engine...</div>}>
        <AnalyzeContent />
      </Suspense>
      <Footer />
    </>
  )
}
