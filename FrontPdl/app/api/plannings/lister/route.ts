import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://localhost:8080/api/planning/afficherplannings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Backend response not ok:", response.status, response.statusText)
      return NextResponse.json({ error: "Erreur lors de la récupération des plannings" }, { status: response.status })
    }

    const data = await response.json()
    console.log("Plannings récupérés:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la récupération des plannings" }, { status: 500 })
  }
}
