"use client"

import { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, Wind, Droplets, AlertTriangle, CheckCircle2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getWeather } from "@/lib/api"
import { useAnalysis } from "@/lib/analysis-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import Link from "next/link"

const FORECAST_RANGES = [1, 3, 5, 7]

export function WeatherForecast() {
    const { result } = useAnalysis()
    const [range, setRange] = useState(3)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showUpgrade, setShowUpgrade] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(null)
        const lat = result?.lat || 34.05
        const lon = result?.lon || -118.24
        getWeather(lat, lon, range)
            .then((res) => {
                setData(res)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to fetch weather", err)
                setError("Unable to connect to weather service. Please check your internet or backend connection.")
                setLoading(false)
            })
    }, [range, result?.lat, result?.lon])

    const getWeatherIcon = (rain: number) => {
        if (rain > 5) return CloudRain
        if (rain > 0.5) return Cloud
        return Sun
    }

    if (loading && !data) return <Card className="border-border/60 animate-pulse h-96" />

    return (
        <>
            <Card className="border-border/60 overflow-hidden bg-background/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Sun className="h-5 w-5 text-amber-500" />
                            Field Weather Intelligence
                        </CardTitle>
                        <CardDescription>Predictive stress modeling based on upcoming conditions</CardDescription>
                    </div>
                    <div className="flex bg-muted rounded-lg p-1">
                        {FORECAST_RANGES.map((r) => (
                            <Button
                                key={r}
                                variant={range === r ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-8 px-3 text-xs relative",
                                    r > 3 && "text-muted-foreground"
                                )}
                                onClick={() => {
                                    if (r > 3) {
                                        setShowUpgrade(true)
                                        return
                                    }
                                    setRange(r)
                                }}
                            >
                                {r}d
                                {r > 3 && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                )}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error ? (
                        <div className="flex flex-col items-center justify-center p-8 bg-destructive/5 border border-destructive/20 rounded-xl gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <p className="text-sm text-center font-medium text-destructive">{error}</p>
                            <Button variant="outline" size="sm" onClick={() => setRange(range)}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Forecast Strip */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {data?.forecast.map((day: any) => {
                                    const Icon = getWeatherIcon(day.rain)
                                    return (
                                        <div
                                            key={day.date}
                                            className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl bg-muted/30 border border-border/40 transition-all hover:bg-muted/50"
                                        >
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                            </span>
                                            <Icon className={cn("h-6 w-6", day.rain > 0.5 ? "text-blue-400" : "text-amber-400")} />
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">{Math.round(day.temp_max)}°</span>
                                                <span className="text-[10px] text-muted-foreground">{Math.round(day.temp_min)}°</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Predictive Alerts */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-primary" />
                                    Predictive Stress Alerts
                                </h4>
                                <div className="grid gap-3">
                                    {data?.predictive_alerts.length > 0 ? (
                                        data.predictive_alerts.map((alert: any, i: number) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex flex-col gap-1 p-3 rounded-lg border leading-tight transition-all",
                                                    alert.severity === "High"
                                                        ? "bg-destructive/10 border-destructive/20"
                                                        : "bg-amber-500/10 border-amber-500/20"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider">{alert.type}</span>
                                                    <Badge variant="outline" className="text-[10px] h-4">
                                                        {new Date(alert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-medium">{alert.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                            <p className="text-xs font-medium text-emerald-500">No immediate weather stress predicted for the selected range.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Weather Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                                    <Droplets className="h-5 w-5 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg Humidity</span>
                                        <span className="text-lg font-bold">{Math.round(data?.forecast[0]?.humidity || 0)}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <Wind className="h-5 w-5 text-orange-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Max Wind</span>
                                        <span className="text-lg font-bold">{data?.forecast[0]?.wind || 0} <span className="text-xs">km/h</span></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
                <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-md border-primary/20">
                    <DialogHeader>
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Unlock Premium Intelligence</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Advanced 7-day predictive modeling and hyper-local stress detection are exclusive to our Professional plan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            {[
                                "Extended 7-day Weather Forecast",
                                "Hyper-local Stress Prediction Models",
                                "Early Disease Risk Alerts (Proprietary)",
                                "Unlimited Field Scans & Analysis"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="ghost" onClick={() => setShowUpgrade(false)} className="sm:flex-1">
                            Maybe Later
                        </Button>
                        <Button asChild className="sm:flex-1 bg-primary hover:bg-primary/90">
                            <Link href="/pricing" onClick={() => setShowUpgrade(false)}>
                                Upgrade to Professional
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
