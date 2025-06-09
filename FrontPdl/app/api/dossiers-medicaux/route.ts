import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dossiermedical/afficherdossiermedicals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const dossiers = await response.json()
    return NextResponse.json(dossiers)
  } catch (error) {
    console.error("Error fetching dossiers medicaux:", error)
    return NextResponse.json({ error: "Failed to fetch dossiers medicaux" }, { status: 500 })
  }
}
