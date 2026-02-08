"use client"

import React from "react"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void
  preview: string | null
  onClear: () => void
}

export function ImageUploader({ onImageSelect, preview, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageSelect(file, reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  if (preview) {
    return (
      <Card className="border-border/60">
        <CardContent className="relative p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-6 top-6 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={onClear}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
          <Image
            src={preview || "/placeholder.svg"}
            alt="Uploaded field image preview"
            width={800}
            height={500}
            className="w-full rounded-lg object-cover"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border/60"
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center gap-4 p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-lg font-semibold text-foreground">Upload Drone Image</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your RGB field image, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, TIFF up to 50MB
          </p>
        </div>
        <label htmlFor="file-upload">
          <Button asChild variant="outline" className="cursor-pointer gap-2 bg-transparent">
            <span>
              <Upload className="h-4 w-4" />
              Browse Files
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleChange}
          />
        </label>
      </CardContent>
    </Card>
  )
}
