import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">AgriVision</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/analyze", label: "Analyze" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/insights", label: "Insights" },
            { href: "/pricing", label: "Pricing" },
            { href: "/technology", label: "Satellite" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          {"2026 AgriVision. Precision Agriculture Platform."}
        </p>
      </div>
    </footer>
  )
}
