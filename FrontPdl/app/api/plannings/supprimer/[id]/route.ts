import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planningId = params.id
    console.log("Suppression planning ID:", planningId)

    const response = await fetch(`http://localhost:8080/api/planning/supprimerplanning/${planningId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erreur backend:", response.status, errorText)
      return NextResponse.json(
        { error: `Erreur lors de la suppression du planning: ${errorText}` },
        { status: response.status },
      )
    }

    console.log("Planning supprimé avec succès")
    return NextResponse.json({ message: "Planning supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du planning:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la suppression du planning" }, { status: 500 })
  }
}
