import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Données reçues pour création planning:", body)

    // Préparer les données pour le backend
    const planningData = {
      jour: body.jour,
      heureDebut: body.heureDebut,
      heureFin: body.heureFin,
      utilisateur: {
        id: Number.parseInt(body.utilisateurId),
      },
    }

    console.log("Données envoyées au backend:", planningData)

    const response = await fetch("http://localhost:8080/api/planning/ajouterplanning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planningData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erreur backend:", response.status, errorText)
      return NextResponse.json(
        { error: `Erreur lors de la création du planning: ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Planning créé avec succès:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la création du planning:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la création du planning" }, { status: 500 })
  }
}
