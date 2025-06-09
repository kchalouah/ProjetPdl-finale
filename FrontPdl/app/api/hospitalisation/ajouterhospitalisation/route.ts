import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const hospitalisationData = await request.json()

    const response = await fetch("http://localhost:8080/api/hospitalisation/ajouterhospitalisation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hospitalisationData),
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

    const result = await response.json()
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
    return NextResponse.json(
      {
        error:
          "Impossible de se connecter au serveur backend. Vérifiez que le serveur Spring Boot est démarré sur le port 8080.",
      },
      { status: 503 },
    )
  }
}
