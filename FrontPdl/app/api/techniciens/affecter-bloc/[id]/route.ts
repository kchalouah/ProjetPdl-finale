import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/techniciens/affecter-bloc/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const technicien = await response.json()
    return NextResponse.json(technicien)
  } catch (error) {
    console.error("Error affecting bloc to technicien:", error)
    return NextResponse.json({ error: "Failed to affect bloc" }, { status: 500 })
  }
}
