import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`http://localhost:8080/api/bloc/supprimerbloc/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return NextResponse.json({ message: "Bloc supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting bloc:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression du bloc" }, { status: 500 })
  }
}
