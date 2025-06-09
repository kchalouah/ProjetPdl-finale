import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/infirmiers/affecter-service/${params.id}`, {
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

    const infirmier = await response.json()
    return NextResponse.json(infirmier)
  } catch (error) {
    console.error("Error affecting service to infirmier:", error)
    return NextResponse.json({ error: "Failed to affect service" }, { status: 500 })
  }
}
