import { NextResponse } from "next/server"

// Données simulées pour les patients
const patients = [
  {
    id: 1,
    nom: "Durand",
    prenom: "Robert",
    email: "robert.durand@email.com",
    dateNaissance: "1970-06-15",
    adresse: "123 Rue de Paris, 75001 Paris",
    telephone: "0123456789"
  },
  {
    id: 2,
    nom: "Moreau",
    prenom: "Julie",
    email: "julie.moreau@email.com",
    dateNaissance: "1985-10-22",
    adresse: "456 Avenue Victor Hugo, 69002 Lyon",
    telephone: "0987654321"
  },
  {
    id: 3,
    nom: "Petit",
    prenom: "Thomas",
    email: "thomas.petit@email.com",
    dateNaissance: "1990-03-10",
    adresse: "789 Boulevard Gambetta, 59000 Lille",
    telephone: "0654321987"
  },
  {
    id: 4,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@email.com",
    dateNaissance: "1982-12-05",
    adresse: "321 Rue de la République, 13001 Marseille",
    telephone: "0712345678"
  }
]

export async function GET() {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json(patients)
}