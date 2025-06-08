"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, User, Calendar, Pill } from "lucide-react"
import Link from "next/link"

interface DossierMedical {
  id: number
  dateCreation: string
  antecedentsMedicaux: string
  resultatsBiologiques: string
  resultatsRadiologiques: string
}

interface Consultation {
  id: number
  dateHeure: string
  notes: string
  actesRealises: string
  medecin: string
}

interface Ordonnance {
  id: number
  dateHeure: string
  prescriptions: string
  dureeTraitement?: number
  instructions: string
  medecin: string
  status: string
}

export default function MonDossierPage() {
  const [dossier, setDossier] = useState<DossierMedical | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || ""
    setUserEmail(email)
    fetchDossier()
    fetchConsultations()
    fetchOrdonnances()
  }, [])

  const fetchDossier = async () => {
    try {
      // Simulation de données
      const mockDossier: DossierMedical = {
        id: 1,
        dateCreation: "2024-01-15",
        antecedentsMedicaux:
          "Hypertension artérielle familiale\nAllergie aux pénicillines\nIntervention appendicectomie en 2010",
        resultatsBiologiques:
          "Dernière analyse (15/01/2024):\n- Glycémie: 0.95 g/L (Normal)\n- Cholestérol total: 1.8 g/L (Normal)\n- HDL: 0.6 g/L (Bon)\n- LDL: 1.1 g/L (Normal)",
        resultatsRadiologiques:
          "Radio thorax (10/01/2024): RAS\nÉchographie abdominale (05/01/2024): Foie et reins normaux",
      }
      setDossier(mockDossier)
    } catch (error) {
      console.error("Erreur lors du chargement du dossier:", error)
    }
  }

  const fetchConsultations = async () => {
    try {
      // Simulation de données
      const mockConsultations: Consultation[] = [
        {
          id: 1,
          dateHeure: "2024-01-20T10:30:00",
          notes: "Consultation de routine. Patient en bonne santé générale. Tension artérielle normale.",
          actesRealises: "Examen clinique complet, prise de tension",
          medecin: "Dr. Dupont - Médecin généraliste",
        },
        {
          id: 2,
          dateHeure: "2024-01-15T14:15:00",
          notes: "Suivi analyses biologiques. Résultats dans les normes.",
          actesRealises: "Interprétation analyses, conseils hygiéno-diététiques",
          medecin: "Dr. Martin - Cardiologue",
        },
      ]
      setConsultations(mockConsultations)
    } catch (error) {
      console.error("Erreur lors du chargement des consultations:", error)
    }
  }

  const fetchOrdonnances = async () => {
    try {
      // Simulation de données
      const mockOrdonnances: Ordonnance[] = [
        {
          id: 1,
          dateHeure: "2024-01-20T10:30:00",
          prescriptions:
            "Paracétamol 1g - 1 comprimé si douleur (max 3/jour)\nVitamine D 1000 UI - 1 comprimé par jour",
          dureeTraitement: 30,
          instructions:
            "Prendre le paracétamol uniquement en cas de douleur. La vitamine D à prendre le matin avec un verre d'eau.",
          medecin: "Dr. Dupont",
          status: "ACTIVE",
        },
      ]
      setOrdonnances(mockOrdonnances)
    } catch (error) {
      console.error("Erreur lors du chargement des ordonnances:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (!dossier) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Dossier Médical</h1>
            <p className="text-gray-600">Consulter mes informations médicales</p>
          </div>
        </div>

        {/* Dossier Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Dossier Médical</h2>
                <p className="text-gray-600">Créé le {formatDate(dossier.dateCreation)}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="antecedents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="antecedents">Antécédents</TabsTrigger>
            <TabsTrigger value="examens">Examens</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="ordonnances">Ordonnances</TabsTrigger>
          </TabsList>

          {/* Antécédents Tab */}
          <TabsContent value="antecedents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Antécédents Médicaux
                </CardTitle>
                <CardDescription>Historique médical et allergies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {dossier.antecedentsMedicaux || "Aucun antécédent médical renseigné"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examens Tab */}
          <TabsContent value="examens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Résultats Biologiques</CardTitle>
                <CardDescription>Analyses de sang et autres examens biologiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {dossier.resultatsBiologiques || "Aucun résultat biologique disponible"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résultats Radiologiques</CardTitle>
                <CardDescription>Imagerie médicale et examens radiologiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {dossier.resultatsRadiologiques || "Aucun résultat radiologique disponible"}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mes Consultations ({consultations.length})
                </CardTitle>
                <CardDescription>Historique de mes consultations médicales</CardDescription>
              </CardHeader>
              <CardContent>
                {consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <Card key={consultation.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline">{formatDateTime(consultation.dateHeure)}</Badge>
                            <span className="text-sm text-gray-500">{consultation.medecin}</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Notes de consultation</h4>
                              <p className="text-sm text-gray-700">{consultation.notes}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Actes réalisés</h4>
                              <p className="text-sm text-gray-700">{consultation.actesRealises}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune consultation enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ordonnances Tab */}
          <TabsContent value="ordonnances">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Mes Ordonnances ({ordonnances.length})
                </CardTitle>
                <CardDescription>Prescriptions médicales en cours et passées</CardDescription>
              </CardHeader>
              <CardContent>
                {ordonnances.length > 0 ? (
                  <div className="space-y-4">
                    {ordonnances.map((ordonnance) => (
                      <Card key={ordonnance.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{formatDateTime(ordonnance.dateHeure)}</Badge>
                              <Badge className={getStatusColor(ordonnance.status)}>
                                {ordonnance.status === "ACTIVE" ? "Active" : "Terminée"}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-500">{ordonnance.medecin}</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Prescriptions</h4>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {ordonnance.prescriptions}
                              </div>
                            </div>
                            {ordonnance.dureeTraitement && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Durée du traitement</h4>
                                <p className="text-sm text-gray-700">{ordonnance.dureeTraitement} jours</p>
                              </div>
                            )}
                            {ordonnance.instructions && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Instructions</h4>
                                <p className="text-sm text-gray-700">{ordonnance.instructions}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune ordonnance disponible</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
