import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://localhost:8080/api/patients/tous", {
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

    const patients = await response.json()
    return NextResponse.json(patients)
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
