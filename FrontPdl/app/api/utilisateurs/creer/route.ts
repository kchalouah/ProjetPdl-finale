import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    console.log("Original user data:", JSON.stringify(userData, null, 2))

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

    // Format date properly if it exists for PATIENT
    if (userData.role === "PATIENT") {
      // Validate required patient fields
      if (!userData.dateNaissance) {
        return NextResponse.json({ error: "Date de naissance is required for patients" }, { status: 400 })
      }
      if (!userData.adresse || userData.adresse.trim() === "") {
        return NextResponse.json({ error: "Adresse is required for patients" }, { status: 400 })
      }
      if (!userData.telephone || userData.telephone.trim() === "") {
        return NextResponse.json({ error: "Telephone is required for patients" }, { status: 400 })
      }

      // Format date properly - ensure it's in YYYY-MM-DD format
      if (userData.dateNaissance) {
        try {
          // Try to parse the date
          const dateParts = userData.dateNaissance.split("-")
          if (dateParts.length === 3) {
            // Already in YYYY-MM-DD format, validate it
            const year = Number.parseInt(dateParts[0], 10)
            const month = Number.parseInt(dateParts[1], 10) - 1 // JS months are 0-indexed
            const day = Number.parseInt(dateParts[2], 10)

            const date = new Date(year, month, day)

            // Check if the date is valid
            if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
              // Date is valid, keep the format
              console.log("Date is valid in YYYY-MM-DD format:", userData.dateNaissance)
            } else {
              return NextResponse.json({ error: "Invalid date format. Please use YYYY-MM-DD format." }, { status: 400 })
            }
          } else {
            // Try to parse as a Date object
            const date = new Date(userData.dateNaissance)
            if (isNaN(date.getTime())) {
              return NextResponse.json({ error: "Invalid date format. Please use YYYY-MM-DD format." }, { status: 400 })
            }

            // Format as YYYY-MM-DD
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            userData.dateNaissance = `${year}-${month}-${day}`
            console.log("Reformatted date:", userData.dateNaissance)
          }
        } catch (e) {
          console.error("Date parsing error:", e)
          return NextResponse.json({ error: "Invalid date format. Please use YYYY-MM-DD format." }, { status: 400 })
        }
      }
    }

    console.log("Sending user data to backend:", JSON.stringify(userData, null, 2))

    const response = await fetch("http://localhost:8080/api/utilisateurs/creer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      signal: AbortSignal.timeout(10000),
    })

    const responseText = await response.text()
    console.log("Backend response:", response.status, responseText)

    if (!response.ok) {
      console.error(`Backend error: ${response.status} - ${responseText}`)
      return NextResponse.json(
          { error: `Erreur backend: ${response.status} - ${responseText}` },
          { status: response.status },
      )
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      // If response is not JSON, return the text
      result = { message: responseText }
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Erreur de connexion au backend:", error)
    return NextResponse.json(
        {
          error: `Erreur lors de la création de l'utilisateur: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 503 },
    )
  }
}
