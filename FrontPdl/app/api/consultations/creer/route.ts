import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const medecinId = request.nextUrl.searchParams.get("medecinId")
        const patientId = request.nextUrl.searchParams.get("patientAttachmentId") // vient du frontend

        if (!medecinId || !patientId) {
            return NextResponse.json(
                { message: "Paramètres requis manquants (medecinId ou patientAttachmentId)" },
                { status: 400 }
            )
        }

        const body = await request.json()

        const response = await fetch(
            `http://localhost:8080/api/consultations/creer?medecinId=${medecinId}&patientId=${patientId}`, // ✅ CORRECT ICI
            {
                method: "POST",
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
        console.error("Erreur lors de la création de la consultation:", error)
        return NextResponse.json(
            { message: "Erreur lors de la création de la consultation" },
            { status: 500 }
        )
    }
}
