import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const consultationId = body.consultationId;
    const { date, description } = body;

    if (!consultationId) {
      return NextResponse.json(
        { message: "consultationId est requis" },
        { status: 400 }
      );
    }
    if (!date || !description) {
      return NextResponse.json(
        { message: "date et description sont requis" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://localhost:8080/api/diagnostic/ajouterdiagnostic?consultationId=${Number(consultationId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, description }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding diagnostic:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout du diagnostic" },
      { status: 500 }
    );
  }
}