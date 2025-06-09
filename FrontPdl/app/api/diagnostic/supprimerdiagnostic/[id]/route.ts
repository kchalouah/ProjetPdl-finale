import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const response = await fetch(`http://localhost:8080/api/diagnostic/supprimerdiagnostic/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return NextResponse.json({ message: "Diagnostic supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting diagnostic:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression du diagnostic" }, { status: 500 })
  }
}
