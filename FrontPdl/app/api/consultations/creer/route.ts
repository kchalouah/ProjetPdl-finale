import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { medecinId, dossierMedicalId } = request.nextUrl.searchParams
    const body = await request.json()

    const response = await fetch(
      `http://localhost:8080/api/consultation/ajouterconsultation?medecinId=${medecinId}&dossierMedicalId=${dossierMedicalId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating consultation:", error)
    return NextResponse.json({ message: "Erreur lors de la création de la consultation" }, { status: 500 })
  }
}
