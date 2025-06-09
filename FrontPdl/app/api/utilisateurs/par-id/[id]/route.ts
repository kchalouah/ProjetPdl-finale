import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    const response = await fetch(`http://localhost:8080/api/utilisateurs/par-id/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Erreur backend: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const user = await response.json()
    return NextResponse.json(user)
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
    return NextResponse.json(
      {
        error: `Erreur lors de la récupération de l'utilisateur: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 503 },
    )
  }
}
