import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const motDePasse = formData.get("motDePasse") as string

    // Validation des champs
    if (!email || !motDePasse) {
      return NextResponse.json(
        {
          success: false,
          message: "Email et mot de passe requis",
        },
        { status: 400 },
      )
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format d'email invalide",
        },
        { status: 400 },
      )
    }

    // Tentative de connexion au backend Spring Boot
    try {
      const backendResponse = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          motDePasse,
        }),
        // Timeout de 5 secondes
        signal: AbortSignal.timeout(5000),
      })

      if (backendResponse.ok) {
        const result = await backendResponse.json()
        return NextResponse.json({
          success: true,
          message: "Connexion réussie",
          role: result.role,
          user: result.user,
          source: "backend",
        })
      } else {
        const errorData = await backendResponse.json().catch(() => ({}))
        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "Identifiants incorrects",
          },
          { status: 401 },
        )
      }
    } catch (backendError) {
      console.log("Backend non disponible, utilisation de l'authentification simulée")

      // Simulation d'authentification si le backend n'est pas disponible
      const validCredentials = [
        {
          email: "admin@hopital.fr",
          password: "password123",
          role: "ADMINISTRATEUR",
          nom: "Administrateur",
          prenom: "Système",
        },
        {
          email: "medecin@hopital.fr",
          password: "password123",
          role: "MEDECIN",
          nom: "Dupont",
          prenom: "Jean",
          specialite: "CARDIOLOGIE",
        },
        {
          email: "infirmier@hopital.fr",
          password: "password123",
          role: "INFIRMIER",
          nom: "Martin",
          prenom: "Marie",
        },
        {
          email: "technicien@hopital.fr",
          password: "password123",
          role: "TECHNICIEN",
          nom: "Moreau",
          prenom: "Paul",
        },
        {
          email: "patient@hopital.fr",
          password: "password123",
          role: "PATIENT",
          nom: "Durand",
          prenom: "Sophie",
        },
      ]

      const user = validCredentials.find((cred) => cred.email === email && cred.password === motDePasse)

      if (user) {
        return NextResponse.json({
          success: true,
          message: "Connexion réussie (mode simulation)",
          role: user.role,
          user: {
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            specialite: user.specialite,
          },
          source: "simulation",
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Email ou mot de passe incorrect",
          },
          { status: 401 },
        )
      }
    }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur interne. Veuillez réessayer plus tard.",
      },
      { status: 500 },
    )
  }
}
