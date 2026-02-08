"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/landing/hero-field.png"
          alt="Aerial view of agricultural farmland"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <div className="flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI-Powered Crop Intelligence
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Precision Agriculture
            <br />
            <span className="text-primary">From the Sky</span>
          </h1>

          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Transform drone imagery into actionable farming insights. Monitor crop health,
            detect anomalies, and optimize yields with AI-powered NDVI analysis and
            real-time decision support.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/analyze">
                <Scan className="h-4 w-4" />
                Analyze Crop
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4" />
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
