import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`http://localhost:8080/api/chambre/supprimerchambre/${params.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`)
    }

    return NextResponse.json({ message: "Chambre supprimée avec succès" })
  } catch (error) {
    console.error("Erreur suppression chambre:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression de la chambre" }, { status: 500 })
  }
}
