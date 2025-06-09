"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, User, Calendar, Pill, Stethoscope } from "lucide-react"
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

interface Diagnostic {
  id: number
  dateHeure: string
  description: string
  medecin: string
}

export default function MonDossierPage() {
  const [dossier, setDossier] = useState<DossierMedical | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || ""
    setUserEmail(email)
    fetchDossier()
    if (email) {
      fetchConsultations(email)
      fetchOrdonnances(email)
      fetchDiagnostics(email)
    }
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

  const fetchConsultations = async (email: string) => {
    try {
      const res = await fetch(`/api/consultations/patient?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error("Erreur API consultations")
      const data = await res.json()
      setConsultations(
        data.map((c: any) => ({
          id: c.id,
          dateHeure: c.dateHeure || c.date_heure,
          notes: c.notes,
          actesRealises: c.actesRealises,
          medecin: c.medecin?.nom || c.medecinNom || "Médecin inconnu",
        }))
      )
    } catch (error) {
      setConsultations([])
      console.error("Erreur lors du chargement des consultations:", error)
    }
  }

  const fetchOrdonnances = async (email: string) => {
    try {
      const res = await fetch(`/api/ordonnances/patient?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error("Erreur API ordonnances")
      const data = await res.json()
      setOrdonnances(
        data.map((o: any) => ({
          id: o.id,
          dateHeure: o.dateHeure || o.date_heure,
          prescriptions: o.prescriptions,
          dureeTraitement: o.dureeTraitement,
          instructions: o.instructions,
          medecin: o.medecin?.nom || o.medecinNom || "Médecin inconnu",
          status: o.status || "ACTIVE",
        }))
      )
    } catch (error) {
      setOrdonnances([])
      console.error("Erreur lors du chargement des ordonnances:", error)
    }
  }

  const fetchDiagnostics = async (email: string) => {
    try {
      const res = await fetch(`/api/diagnostics/patient?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error("Erreur API diagnostics")
      const data = await res.json()
      setDiagnostics(
        data.map((d: any) => ({
          id: d.id,
          dateHeure: d.dateHeure || d.date_heure,
          description: d.description,
          medecin: d.medecin?.nom || d.medecinNom || "Médecin inconnu",
        }))
      )
    } catch (error) {
      setDiagnostics([])
      console.error("Erreur lors du chargement des diagnostics:", error)
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

        {/* Tabs - Only Consultations, Ordonnances, Diagnostics */}
        <Tabs defaultValue="consultations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="ordonnances">Ordonnances</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>

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

          {/* Diagnostics Tab */}
          <TabsContent value="diagnostics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Mes Diagnostics ({diagnostics.length})
                </CardTitle>
                <CardDescription>Résultats et analyses diagnostiques</CardDescription>
              </CardHeader>
              <CardContent>
                {diagnostics.length > 0 ? (
                  <div className="space-y-4">
                    {diagnostics.map((diag) => (
                      <Card key={diag.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline">{formatDateTime(diag.dateHeure)}</Badge>
                            <span className="text-sm text-gray-500">{diag.medecin}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                              {diag.description}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun diagnostic disponible</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}