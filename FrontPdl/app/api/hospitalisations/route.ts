import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hospitalisation/afficherhospitalisations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const hospitalisations = await response.json()
    return NextResponse.json(hospitalisations)
  } catch (error) {
    console.error("Error fetching hospitalisations:", error)
    return NextResponse.json({ error: "Failed to fetch hospitalisations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/hospitalisation/ajouterhospitalisation`, {
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

    const hospitalisation = await response.json()
    return NextResponse.json(hospitalisation)
  } catch (error) {
    console.error("Error creating hospitalisation:", error)
    return NextResponse.json({ error: "Failed to create hospitalisation" }, { status: 500 })
  }
}
