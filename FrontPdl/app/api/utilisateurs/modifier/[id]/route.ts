import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const userId = params.id

    // Ensure the role is a string (not an object) for proper backend handling
    if (userData.role && typeof userData.role === "object" && userData.role.value) {
      userData.role = userData.role.value
    }

    // Ensure specialite is properly formatted for MEDECIN
    if (
      userData.role === "MEDECIN" &&
      userData.specialite &&
      typeof userData.specialite === "object" &&
      userData.specialite.value
    ) {
      userData.specialite = userData.specialite.value
    }

    // Format date properly if it exists
    if (userData.dateNaissance && typeof userData.dateNaissance === "object") {
      // Convert Date object to ISO string and then to YYYY-MM-DD
      const date = new Date(userData.dateNaissance)
      userData.dateNaissance = date.toISOString().split("T")[0]
    }

    // Add type field for proper JSON deserialization on backend
    if (userData.role) {
      switch (userData.role) {
        case "MEDECIN":
          userData.type = "medecin"
          break
        case "PATIENT":
          userData.type = "patient"
          break
        case "ADMINISTRATEUR":
          userData.type = "administrateur"
          break
        case "INFIRMIER":
          userData.type = "infirmier"
          break
        case "TECHNICIEN":
          userData.type = "technicien"
          break
      }
    }

    console.log("Sending user update data to backend:", JSON.stringify(userData, null, 2))

    const response = await fetch(`http://localhost:8080/api/utilisateurs/modifier/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
    return NextResponse.json(
      {
        error: `Erreur lors de la modification de l'utilisateur: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 503 },
    )
  }
}
