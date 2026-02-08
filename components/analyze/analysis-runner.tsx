"use client"

import { Loader2, Scan, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AnalysisRunnerProps {
  hasImage: boolean
  isAnalyzing: boolean
  progress: number
  stage: string
  isComplete: boolean
  onRun: () => void
}

export function AnalysisRunner({
  hasImage,
  isAnalyzing,
  progress,
  stage,
  isComplete,
  onRun,
}: AnalysisRunnerProps) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">AI Analysis Engine</h3>
          <p className="text-sm text-muted-foreground">
            Our CNN model processes the uploaded imagery to generate NDVI values,
            detect anomalies, and classify crop health zones.
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex flex-col gap-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              {stage}
            </div>
          </div>
        )}

        {isComplete && !isAnalyzing && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Analysis complete. Redirecting to dashboard...
          </div>
        )}

        <Button
          size="lg"
          className="gap-2"
          disabled={!hasImage || isAnalyzing}
          onClick={onRun}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4" />
              Run AI Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
