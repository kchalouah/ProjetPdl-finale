import { NextResponse } from "next/server"

// Données simulées pour les services
const services = [
  {
    id: 1,
    nom: "Cardiologie",
    description: "Service spécialisé dans les maladies cardiovasculaires"
  },
  {
    id: 2,
    nom: "Pédiatrie",
    description: "Service dédié aux soins des enfants"
  },
  {
    id: 3,
    nom: "Neurologie",
    description: "Service spécialisé dans les troubles du système nerveux"
  },
  {
    id: 4,
    nom: "Dermatologie",
    description: "Service traitant les affections de la peau"
  }
]

export async function GET() {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json(services)
}