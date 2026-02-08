"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface AnalysisResult {
  ndvi: number
  affectedArea: number
  severity: "Low" | "Medium" | "High"
  confidence: number
  timestamp: string
  imageName: string
  heatmapUrl?: string
  rgbUrl?: string
  insights?: any[]
  lat?: number
  lon?: number
  metadata?: {
    sensor: string
    resolution: string
    cloudCover: string
    bands: string[]
  }
}

interface AnalysisContextType {
  result: AnalysisResult | null
  setResult: (result: AnalysisResult) => void
  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

const DEFAULT_RESULT: AnalysisResult = {
  ndvi: 0.62,
  affectedArea: 23.4,
  severity: "Medium",
  confidence: 91.7,
  timestamp: new Date().toISOString(),
  imageName: "field_scan_001.tif",
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("latest_analysis")
    if (saved) {
      try {
        setResultState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved analysis", e)
        setResultState(DEFAULT_RESULT)
      }
    } else {
      setResultState(DEFAULT_RESULT)
    }
    setIsLoaded(true)
  }, [])

  const setResult = (newResult: AnalysisResult) => {
    setResultState(newResult)
    localStorage.setItem("latest_analysis", JSON.stringify(newResult))
  }

  if (!isLoaded) return null // Prevent hydration mismatch

  return (
    <AnalysisContext.Provider value={{ result, setResult, isAnalyzing, setIsAnalyzing }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) throw new Error("useAnalysis must be used within AnalysisProvider")
  return context
}
