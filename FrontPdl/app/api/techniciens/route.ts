import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/techniciens/lister`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const techniciens = await response.json()
    return NextResponse.json(techniciens)
  } catch (error) {
    console.error("Error fetching techniciens:", error)
    return NextResponse.json({ error: "Failed to fetch techniciens" }, { status: 500 })
  }
}
