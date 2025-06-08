import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simuler une base de données d'hospitalisations
let hospitalisations = [
  {
    id: 1,
    patientId: 1,
    serviceId: 1,
    dateAdmission: "2023-05-15",
    dateSortie: "2023-05-20",
    chambre: "101"
  },
  {
    id: 2,
    patientId: 2,
    serviceId: 2,
    dateAdmission: "2023-06-10",
    dateSortie: null,
    chambre: "201"
  }
]

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const data = await request.json()
    
    // Validation des données
    if (!data.patientId || !data.serviceId || !data.dateAdmission) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Données incomplètes. Patient, service et date d'admission sont requis." 
        }, 
        { status: 400 }
      )
    }
    
    // Créer une nouvelle hospitalisation
    const newHospitalisation = {
      id: hospitalisations.length + 1,
      patientId: data.patientId,
      serviceId: data.serviceId,
      dateAdmission: data.dateAdmission,
      dateSortie: data.dateSortie || null,
      chambre: Math.floor(Math.random() * 5 + 1) + "0" + Math.floor(Math.random() * 5 + 1) // Chambre aléatoire
    }
    
    // Ajouter à notre "base de données"
    hospitalisations.push(newHospitalisation)
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({ 
      success: true, 
      message: "Hospitalisation créée avec succès", 
      hospitalisation: newHospitalisation 
    })
  } catch (error) {
    console.error("Erreur lors de la création de l'hospitalisation:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Erreur lors de la création de l'hospitalisation" 
      }, 
      { status: 500 }
    )
  }
}