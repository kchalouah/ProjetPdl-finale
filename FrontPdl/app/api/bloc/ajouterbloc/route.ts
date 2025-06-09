import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // FIX: Correctly extract serviceId from the URL query params
    const url = new URL(request.url)
    const serviceId = url.searchParams.get("serviceId")
    const body = await request.json()

    console.log("API Route /api/bloc/ajouterbloc received:", { serviceId, body })

    if (!serviceId) {
      return NextResponse.json({ message: "serviceId est requis" }, { status: 400 })
    }

    const blocData = { numero: body.numero }
    console.log("Forwarding to backend:", blocData)

    const response = await fetch(`http://localhost:8080/api/bloc/ajouterbloc?serviceId=${serviceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocData),
    })

    const backendText = await response.text()
    console.log("Backend raw response:", backendText)

    let data
    try {
      data = JSON.parse(backendText)
    } catch {
      data = { raw: backendText }
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur création bloc:", error)
    return NextResponse.json({ message: "Erreur lors de la création du bloc" }, { status: 500 })
  }
}
