import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // ✅ Extraire correctement les paramètres de l'URL
    const medecinId = request.nextUrl.searchParams.get("medecinId")
    const patientAttachmentId = request.nextUrl.searchParams.get("patientAttachmentId")

    if (!medecinId || !patientAttachmentId) {
      return NextResponse.json(
          { message: "Paramètres requis manquants (medecinId ou patientAttachmentId)" },
          { status: 400 }
      )
    }

    // ✅ Lire le corps JSON
    const body = await request.json()

    // ✅ Envoyer la requête vers le backend Spring Boot
    const response = await fetch(
        `http://localhost:8080/api/consultation/modifierconsultation/${id}?medecinId=${medecinId}&patientAttachmentId=${patientAttachmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
    )

    if (!response.ok) {
      throw new Error(`Erreur côté backend: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("Erreur lors de la modification de la consultation:", error)
    return NextResponse.json(
        { message: "Erreur lors de la modification de la consultation" },
        { status: 500 }
    )
  }
}
