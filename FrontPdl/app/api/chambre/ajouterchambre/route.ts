import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const blocId = request.nextUrl.searchParams.get("blocId")
    const body = await request.json()

    if (!blocId) {
      return NextResponse.json({ message: "blocId est requis" }, { status: 400 })
    }

    // Only send numero and capacite in the body
    const chambreData = {
      numero: body.numero,
      capacite: body.capacite,
    }

    const response = await fetch(`http://localhost:8080/api/chambre/ajouterchambre?blocId=${blocId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chambreData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating chambre:", error)
    return NextResponse.json({ message: "Erreur lors de la création de la chambre" }, { status: 500 })
  }
}
