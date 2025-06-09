import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { medecinId, dossierMedicalId } = request.nextUrl.searchParams
    const body = await request.json()

    const response = await fetch(
      `http://localhost:8080/api/consultation/modifierconsultation/${id}?medecinId=${medecinId}&dossierMedicalId=${dossierMedicalId}`,
      {
        method: "PUT",
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
    console.error("Error updating consultation:", error)
    return NextResponse.json({ message: "Erreur lors de la modification de la consultation" }, { status: 500 })
  }
}
