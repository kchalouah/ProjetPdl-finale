import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("http://localhost:8080/api/dossiermedical/afficherdossiermedicals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching dossier medicaux:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des dossiers médicaux" }, { status: 500 })
  }
}
