import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const planningId = params.id

    console.log("Modification planning ID:", planningId)
    console.log("Données reçues:", body)

    // Préparer les données pour le backend
    const planningData = {
      id: Number.parseInt(planningId),
      jour: body.jour,
      heureDebut: body.heureDebut,
      heureFin: body.heureFin,
      utilisateur: {
        id: Number.parseInt(body.utilisateurId || body.id),
      },
    }

    console.log("Données envoyées au backend:", planningData)

    const response = await fetch(`http://localhost:8080/api/planning/modifierplanning/${planningId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planningData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erreur backend:", response.status, errorText)
      return NextResponse.json(
        { error: `Erreur lors de la modification du planning: ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Planning modifié avec succès:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la modification du planning:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la modification du planning" }, { status: 500 })
  }
}
