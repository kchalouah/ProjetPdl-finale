import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    console.log(`Deleting user with ID: ${userId}`)

    const response = await fetch(`http://localhost:8080/api/utilisateurs/supprimer/${userId}`, {
      method: "DELETE",
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

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
    return NextResponse.json(
      {
        error: `Erreur lors de la suppression de l'utilisateur: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 503 },
    )
  }
}
