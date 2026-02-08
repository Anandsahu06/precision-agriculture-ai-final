"use client"

import { Check, Zap, Shield, Globe, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const PRICING_PLANS = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for hobbyist farmers and small trial plots.",
        features: [
            "Up to 5 scans per month",
            "3-Day Weather Forecast",
            "Standard NDVI analysis",
            "Single field management",
            "Mobile app access",
            "Email support",
        ],
        buttonText: "Get Started",
        popular: false,
        icon: Zap,
    },
    {
        name: "Professional",
        price: "49",
        description: "Advanced AI insights for commercial farming success.",
        features: [
            "Unlimited monthly scans",
            "5 & 7-Day Weather Models",
            "High-res VARI & GNDVI maps",
            "Up to 10 field profiles",
            "Pest & Disease AI detection",
            "Priority priority support",
            "Exportable PDF reports",
        ],
        buttonText: "Start Free Trial",
        popular: true,
        icon: Shield,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full-scale solution for agricultural firms and cooperatives.",
        features: [
            "Unlimited field management",
            "Full 7-Day Predictive Analysis",
            "Custom AI model training",
            "API & Webhook integration",
            "Multi-user team access",
            "Dedicated account manager",
            "On-site drone consultation",
        ],
        buttonText: "Contact Sales",
        popular: false,
        icon: Globe,
    },
]
export default function PricingPage() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="mb-16 text-center">
                    <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/20 bg-primary/5">
                        Pricing Plans
                    </Badge>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Scalable Precision for <span className="text-primary">Every Farm</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        From single plots to thousands of hectares, choose the plan that powers your crop intelligence and maximizes yield.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {PRICING_PLANS.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "relative flex flex-col border-border/60 transition-all hover:shadow-xl hover:shadow-primary/5",
                                plan.popular && "border-primary/50 shadow-lg shadow-primary/10"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary px-3 py-1 text-primary-foreground">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <plan.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="mt-2 min-h-[48px]">
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-6 flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold tracking-tight">
                                        {plan.price === "Custom" ? "" : "$"}
                                        {plan.price}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className="text-muted-foreground">/month</span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-foreground">Includes:</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-8">
                                <Button
                                    className={cn(
                                        "w-full py-6 text-base font-semibold",
                                        plan.popular ? "bg-primary hover:bg-primary/90" : "variant-outline"
                                    )}
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 rounded-2xl border border-border/60 bg-muted/30 p-8 text-center md:p-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Trusted by 500+ Agricultural Partners</h2>
                    <p className="mt-2 text-muted-foreground">
                        Our data powers decisions across 2.5 million hectares globally. Join the precision revolution.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0">
                        {/* Mock Logo Space */}
                        <span className="text-xl font-bold tracking-tighter">AGRI-TEK</span>
                        <span className="text-xl font-bold tracking-tighter">TERRA-SYSTEMS</span>
                        <span className="text-xl font-bold tracking-tighter">CROP-SYNC</span>
                        <span className="text-xl font-bold tracking-tighter">GREEN-FIELD</span>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
