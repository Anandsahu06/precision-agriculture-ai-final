"use client"

import { AnimatedCounter } from "@/components/animated-counter"

const STATS = [
  { label: "Crop Yield Increase", value: 34, suffix: "%", decimals: 0 },
  { label: "Acres Analyzed", value: 12500, suffix: "+", decimals: 0 },
  { label: "AI Accuracy", value: 96.3, suffix: "%", decimals: 1 },
  { label: "Faster Detection", value: 10, suffix: "x", decimals: 0 },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-4 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <span className="font-mono text-3xl font-bold text-foreground md:text-4xl">
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                duration={1800}
              />
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
