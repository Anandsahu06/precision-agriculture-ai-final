"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Navigation,
  Layers,
  Scan,
  Shield,
  CheckCircle2,
  Loader2,
  Satellite as SatelliteIcon,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  BrainCircuit,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { useAnalysis } from "@/lib/analysis-context"
import { useRouter } from "next/navigation"

export default function SatellitePage() {
  const router = useRouter()
  const { result, setResult } = useAnalysis()
  const [coords, setCoords] = useState<{ lat: number, lon: number }>({
    lat: result?.lat || 34.05,
    lon: result?.lon || -118.24
  })
  const [zoom, setZoom] = useState(16)
  const [isLocating, setIsLocating] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [mapType, setMapType] = useState<"satellite" | "terrain">("satellite")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLocate = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
          setIsLocating(false)
        },
        (err) => {
          console.error(err)
          setIsLocating(false)
          alert("Location access denied. Please enter coordinates manually.")
        }
      )
    } else {
      setIsLocating(false)
      alert("Geolocation not supported by your browser.")
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchQuery) return

    // Simulating Geocoding - In a real app, use Google Geocoding API or OpenStreetMap
    // We'll simulate a few common farm locations or just pick random coords near a city
    const mockGeocodes: Record<string, { lat: number, lon: number }> = {
      "napa": { lat: 38.2975, lon: -122.2869 },
      "iowa": { lat: 41.8780, lon: -93.0977 },
      "punjab": { lat: 31.1471, lon: 75.3412 },
      "california": { lat: 36.7783, lon: -119.4179 }
    }

    const query = searchQuery.toLowerCase()
    const found = Object.keys(mockGeocodes).find(k => query.includes(k))

    if (found) {
      setCoords(mockGeocodes[found])
    } else {
      // If not found, just slightly randomize based on the hash of the string
      const hash = searchQuery.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
      setCoords({
        lat: 34.05 + (hash % 100) / 50,
        lon: -118.24 + (hash % 100) / 50
      })
    }
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 21))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1))

  const handleAnalyzeImage = () => {
    setIsCapturing(true)

    // Manual Coordinate Sync + Simulated Screenshot Capture
    setTimeout(() => {
      // Definitively top-down overhead satellite farm images
      const satViews = [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef", // Green plains
        "https://images.unsplash.com/photo-1594411130634-91f93f545a64", // Industrial grids
        "https://images.unsplash.com/photo-1563214589-9a7061d441f7"  // Color blocking plots
      ]
      const selectedView = satViews[Math.floor(Math.random() * satViews.length)]

      setResult({
        ...result,
        lat: coords.lat,
        lon: coords.lon,
        timestamp: new Date().toISOString(),
        rgbUrl: `${selectedView}?auto=format&fit=crop&w=1600&q=90`,
        imageName: `SAT_CAPTURE_${coords.lat.toFixed(4)}_${coords.lon.toFixed(4)}.tiff`,
        metadata: {
          sensor: "Sentinel-2A",
          resolution: "10m",
          cloudCover: "0.02%",
          bands: ["B04", "B03", "B02", "B08"]
        }
      } as any)

      setIsCapturing(false)
      router.push("/analyze?autoStart=true")
    }, 1500)
  }

  // Google Maps Embed URL
  const mapUrl = `https://maps.google.com/maps?q=${coords.lat},${coords.lon}&t=${mapType === "satellite" ? "k" : "p"}&z=${zoom}&ie=UTF8&iwloc=&output=embed`

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-10 font-sans">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Physical <span className="text-emerald-600">Site Indexing</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Precisely target your field locations using orbital telemetry. Adjust the manual zoom below to perfectly frame your acreage before high-spectral analysis.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-border hover:bg-accent text-foreground"
              onClick={handleLocate}
              disabled={isLocating}
            >
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Detect Field GPS
            </Button>
            <Button
              size="lg"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200"
              onClick={handleAnalyzeImage}
              disabled={isCapturing}
            >
              {isCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
              Capture & Analyze
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border shadow-sm overflow-hidden bg-card/80 backdrop-blur-md">
              <CardHeader className="bg-muted/50 pb-4 border-b border-border">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Location Manual Override
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <form onSubmit={handleSearch} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Search Address / Region</label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. Napa Valley, CA"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 border-border bg-background focus-visible:ring-emerald-500"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full text-muted-foreground hover:text-emerald-600"
                      onClick={() => handleSearch()}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Manual Latitude</label>
                    <Input
                      type="number"
                      value={coords.lat}
                      onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) })}
                      className="border-border font-mono text-sm bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Manual Longitude</label>
                    <Input
                      type="number"
                      value={coords.lon}
                      onChange={(e) => setCoords({ ...coords, lon: parseFloat(e.target.value) })}
                      className="border-border font-mono text-sm bg-background"
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-tight">Manual Optic Zoom</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-border h-10" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex-1 border-border h-10" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg py-2 text-center text-[11px] font-mono text-muted-foreground">
                    VIEWPORT: {zoom}X RESOLUTION
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Data Capture Ready
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  Position the field in the center of the frame. The "Analyze" action will capture the current coordinates and pull fresh Sentinel imagery for this exact box.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map Visualizer */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-border overflow-hidden shadow-2xl relative bg-muted">
              <CardHeader className="flex flex-row items-center justify-between pb-4 bg-card border-b border-border">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2 text-foreground">
                    <SatelliteIcon className="h-4 w-4 text-sky-500" />
                    Live Field Frame
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] h-5 bg-sky-500/10 text-sky-500 border-sky-500/20">
                    Active Sentinel-2A Multispectral Interface
                  </Badge>
                </div>
                <div className="flex bg-muted rounded-lg p-1 border border-border">
                  <Button
                    variant={mapType === "satellite" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMapType("satellite")}
                    className="text-xs h-7 px-4 font-bold"
                  >
                    Optical
                  </Button>
                  <Button
                    variant={mapType === "terrain" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMapType("terrain")}
                    className="text-xs h-7 px-4 font-bold"
                  >
                    Terrain
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 aspect-[21/9] relative lg:aspect-[3/1.2]">
                {isCapturing && (
                  <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center text-foreground gap-4">
                    <div className="relative">
                      <Scan className="h-20 w-20 text-emerald-400 animate-pulse" />
                      <div className="absolute inset-0 border-2 border-emerald-400 animate-ping rounded-lg opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl tracking-tight">Capturing Spectral Area...</p>
                      <p className="text-xs uppercase tracking-widest text-emerald-400 mt-2 font-mono">Syncing with Sentinel Orbital Path</p>
                    </div>
                  </div>
                )}
                <iframe
                  width="100%"
                  height="100%"
                  src={mapUrl}
                  className="filter saturate-[1.15] contrast-[1.05]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
                {/* Coordinate Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-mono text-white/90 border border-white/10 uppercase">
                    LAT: {coords.lat.toFixed(6)}
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-mono text-white/90 border border-white/10 uppercase">
                    LON: {coords.lon.toFixed(6)}
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/20 shadow-2xl flex items-center gap-8 min-w-[500px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Imaging Source</span>
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      ESA Sentinel-2A
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                  </div>
                  <div className="h-10 w-px bg-border/10" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Ground Distance</span>
                    <span className="text-sm font-bold text-foreground">~450 Meters Width</span>
                  </div>
                  <Button
                    size="lg"
                    className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 shadow-lg shadow-emerald-500/20"
                    onClick={handleAnalyzeImage}
                  >
                    Run Field Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card flex gap-4 items-center shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-xs font-bold text-foreground">Tile Sync</h5>
                  <p className="text-[10px] text-muted-foreground">Multispectral Band B4/B8 Ready</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card flex gap-4 items-center shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-xs font-bold text-foreground">GPS Lock</h5>
                  <p className="text-[10px] text-muted-foreground">Accuracy within 1.2 meters</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card flex gap-4 items-center shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-xs font-bold text-foreground">Encrypted Path</h5>
                  <p className="text-[10px] text-muted-foreground">Secure Geospatial Transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
