"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/api"

export function NdviChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        setData(res.history)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <Card className="border-border/60 animate-pulse h-96" />

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">NDVI Trend Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 57%, 28%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152, 57%, 28%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(150, 5%, 42%)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, 1]}
                className="text-xs"
                tick={{ fill: "hsl(150, 5%, 42%)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(150, 18%, 7%)",
                  borderColor: "hsl(150, 10%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(140, 10%, 95%)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="threshold"
                stroke="hsl(0, 72%, 51%)"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={1.5}
                name="Critical Threshold"
              />
              <Area
                type="monotone"
                dataKey="ndvi"
                stroke="hsl(152, 57%, 28%)"
                fill="url(#ndviGradient)"
                strokeWidth={2}
                name="NDVI Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
