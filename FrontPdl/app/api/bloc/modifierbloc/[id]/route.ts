import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { serviceId } = request.nextUrl.searchParams
    const body = await request.json()

    let url = `http://localhost:8080/api/bloc/modifierbloc/${params.id}`
    if (serviceId) {
      url += `?serviceId=${serviceId}`
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating bloc:", error)
    return NextResponse.json({ message: "Erreur lors de la modification du bloc" }, { status: 500 })
  }
}
