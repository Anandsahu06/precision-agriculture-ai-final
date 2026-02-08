export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://precision-agriculture-ai-backend.onrender.com"

export async function analyzeImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error("Analysis failed")
    }

    return response.json()
}

export async function getDashboardStats() {
    const response = await fetch(`${BACKEND_URL}/dashboard-stats`)
    if (!response.ok) throw new Error("Failed to fetch dashboard stats")
    return response.json()
}

export async function getWeather(lat: number, lon: number, days: number = 7) {
    const response = await fetch(`${BACKEND_URL}/weather?lat=${lat}&lon=${lon}&days=${days}`)
    if (!response.ok) throw new Error("Failed to fetch weather data")
    return response.json()
}
