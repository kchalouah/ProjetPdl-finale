import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plannings/lister`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const plannings = await response.json()
    return NextResponse.json(plannings)
  } catch (error) {
    console.error("Error fetching plannings:", error)
    return NextResponse.json({ error: "Failed to fetch plannings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/plannings/creer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const planning = await response.json()
    return NextResponse.json(planning)
  } catch (error) {
    console.error("Error creating planning:", error)
    return NextResponse.json({ error: "Failed to create planning" }, { status: 500 })
  }
}
