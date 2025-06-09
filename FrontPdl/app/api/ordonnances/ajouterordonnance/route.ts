import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consultation_id, prescriptions, ...rest } = body

    if (!consultation_id || !prescriptions) {
      return NextResponse.json({ message: "consultation_id et prescriptions sont requis" }, { status: 400 })
    }

    const response = await fetch(
      `http://localhost:8080/api/ordonnances/ajouterordonnance?consultationId=${consultation_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...rest, prescriptions }),
      }
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error adding ordonnance:", error)
    return NextResponse.json({ message: "Erreur lors de l'ajout de l'ordonnance" }, { status: 500 })
  }
}