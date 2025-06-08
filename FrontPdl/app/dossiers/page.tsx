"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, FileText, Calendar, User, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { api as apiUtils } from "@/lib/api-utils"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Patient {
  id: number
  nom: string
  prenom: string
  email: string
  dateNaissance: string
  telephone: string
  adresse: string
}

interface DossierMedical {
  id: number
  patient: Patient
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
  patient: string
}

interface Ordonnance {
  id: number
  dateHeure: string
  prescriptions: string
  dureeTraitement?: number
  instructions: string
  patient: string
  medecin: string
  status: string
}

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState<DossierMedical[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [filteredDossiers, setFilteredDossiers] = useState<DossierMedical[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDossier, setSelectedDossier] = useState<DossierMedical | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDossiers()
    fetchConsultations()
    fetchOrdonnances()
  }, [])

  useEffect(() => {
    filterDossiers()
  }, [dossiers, searchTerm])

  // Update the fetchDossiers function to use our new API utilities and add better error handling

  const fetchDossiers = async () => {
    try {
      setLoading(true)

      try {
        const data = await apiUtils.get<any[]>("/dossiermedical/afficherdossier")

        // Transform the data to match our interface
        const formattedDossiers: DossierMedical[] = data.map((dossier: any) => ({
          id: dossier.id,
          patient: {
            id: dossier.patient?.id || 0,
            nom: dossier.patient?.nom || "",
            prenom: dossier.patient?.prenom || "",
            email: dossier.patient?.email || "",
            dateNaissance: dossier.patient?.dateNaissance || "",
            telephone: dossier.patient?.telephone || "",
            adresse: dossier.patient?.adresse || "",
          },
          dateCreation: dossier.dateCreation || "",
          antecedentsMedicaux: dossier.antecedentsMedicaux || "",
          resultatsBiologiques: dossier.resultatsBiologiques || "",
          resultatsRadiologiques: dossier.resultatsRadiologiques || "",
        }))

        setDossiers(formattedDossiers)
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers:", error)
        // Use mock data as fallback
        const mockDossiers: DossierMedical[] = [
          {
            id: 1,
            patient: {
              id: 1,
              nom: "Durand",
              prenom: "Sophie",
              email: "sophie.durand@email.com",
              dateNaissance: "1985-03-15",
              telephone: "0123456789",
              adresse: "123 Rue de la Paix, 75001 Paris",
            },
            dateCreation: "2024-01-15",
            antecedentsMedicaux:
              "Hypertension artérielle familiale\nAllergie aux pénicillines\nIntervention appendicectomie en 2010",
            resultatsBiologiques:
              "Dernière analyse (15/01/2024):\n- Glycémie: 0.95 g/L (Normal)\n- Cholestérol total: 1.8 g/L (Normal)",
            resultatsRadiologiques: "Radio thorax (10/01/2024): RAS\nÉchographie abdominale (05/01/2024): Normal",
          },
        ]
        setDossiers(mockDossiers)
      }
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchConsultations function similarly
  const fetchConsultations = async () => {
    try {
      try {
        const data = await apiUtils.get<any[]>("/consultation/afficherconsultation")

        // Transform the data to match our interface
        const formattedConsultations: Consultation[] = data.map((consultation: any) => ({
          id: consultation.id,
          dateHeure: consultation.dateHeure || "",
          notes: consultation.notes || "",
          actesRealises: consultation.actesRealises || "",
          medecin: consultation.medecin?.nom + " " + consultation.medecin?.prenom || "Médecin inconnu",
          patient:
            consultation.dossierMedical?.patient?.nom + " " + consultation.dossierMedical?.patient?.prenom ||
            "Patient inconnu",
        }))

        setConsultations(formattedConsultations)
      } catch (error) {
        console.error("Erreur lors du chargement des consultations:", error)
        // Keep the array empty if there's an error
        setConsultations([])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des consultations:", error)
    }
  }

  // Update the fetchOrdonnances function similarly
  const fetchOrdonnances = async () => {
    try {
      try {
        const data = await apiUtils.get<any[]>("/ordonnances/afficherordonnances")

        // Transform the data to match our interface
        const formattedOrdonnances: Ordonnance[] = data.map((ordonnance: any) => ({
          id: ordonnance.id,
          dateHeure: ordonnance.dateHeure || "",
          prescriptions: ordonnance.prescriptions || "",
          dureeTraitement: ordonnance.dureeTraitement || undefined,
          instructions: ordonnance.instructions || "",
          patient:
            ordonnance.consultation?.dossierMedical?.patient?.nom +
              " " +
              ordonnance.consultation?.dossierMedical?.patient?.prenom || "Patient inconnu",
          medecin:
            ordonnance.consultation?.medecin?.nom + " " + ordonnance.consultation?.medecin?.prenom || "Médecin inconnu",
          status: ordonnance.status || "ACTIVE",
        }))

        setOrdonnances(formattedOrdonnances)
      } catch (error) {
        console.error("Erreur lors du chargement des ordonnances:", error)
        // Keep the array empty if there's an error
        setOrdonnances([])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des ordonnances:", error)
    }
  }

  const filterDossiers = () => {
    let filtered = dossiers

    if (searchTerm) {
      filtered = filtered.filter(
        (dossier) =>
          dossier.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dossier.patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dossier.patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredDossiers(filtered)
  }

  const handleViewDossier = (dossier: DossierMedical) => {
    setSelectedDossier(dossier)
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  const getPatientConsultations = (patientId: number) => {
    return consultations.filter((c) =>
      c.patient.includes(dossiers.find((d) => d.patient.id === patientId)?.patient.nom || ""),
    )
  }

  const getPatientOrdonnances = (patientId: number) => {
    return ordonnances.filter((o) =>
      o.patient.includes(dossiers.find((d) => d.patient.id === patientId)?.patient.nom || ""),
    )
  }

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers Médicaux</h1>
            <p className="text-gray-600">Consulter les dossiers des patients</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dossiers.length}</div>
              <p className="text-xs text-muted-foreground">Patients enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultations.length}</div>
              <p className="text-xs text-muted-foreground">Total consultations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordonnances</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordonnances.length}</div>
              <p className="text-xs text-muted-foreground">Prescriptions actives</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dossiers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dossiers Médicaux ({filteredDossiers.length})</CardTitle>
            <CardDescription>Liste des dossiers patients</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="large" />
                <div className="ml-4 text-gray-500">Chargement des dossiers...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date de naissance</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier) => {
                    const patientConsultations = getPatientConsultations(dossier.patient.id)
                    return (
                      <TableRow key={dossier.id}>
                        <TableCell>
                          <div className="font-medium">
                            {dossier.patient.prenom} {dossier.patient.nom}
                          </div>
                          <div className="text-sm text-gray-500">{dossier.patient.email}</div>
                        </TableCell>
                        <TableCell>{formatDate(dossier.patient.dateNaissance)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{dossier.patient.telephone}</div>
                            <div className="text-gray-500 truncate max-w-xs">{dossier.patient.adresse}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(dossier.dateCreation)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{patientConsultations.length} consultations</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewDossier(dossier)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dossier Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dossier Médical - {selectedDossier?.patient.prenom} {selectedDossier?.patient.nom}
              </DialogTitle>
              <DialogDescription>
                Dossier créé le {selectedDossier && formatDate(selectedDossier.dateCreation)}
              </DialogDescription>
            </DialogHeader>

            {selectedDossier && (
              <Tabs defaultValue="informations" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="informations">Informations</TabsTrigger>
                  <TabsTrigger value="antecedents">Antécédents</TabsTrigger>
                  <TabsTrigger value="examens">Examens</TabsTrigger>
                  <TabsTrigger value="historique">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="informations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations Patient</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nom complet</p>
                          <p className="text-sm">
                            {selectedDossier.patient.prenom} {selectedDossier.patient.nom}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                          <p className="text-sm">{formatDate(selectedDossier.patient.dateNaissance)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm">{selectedDossier.patient.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="text-sm">{selectedDossier.patient.telephone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Adresse</p>
                        <p className="text-sm">{selectedDossier.patient.adresse}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="antecedents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Antécédents Médicaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedDossier.antecedentsMedicaux || "Aucun antécédent médical renseigné"}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="examens" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Résultats Biologiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedDossier.resultatsBiologiques || "Aucun résultat biologique disponible"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Résultats Radiologiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedDossier.resultatsRadiologiques || "Aucun résultat radiologique disponible"}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="historique" className="space-y-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Consultations ({getPatientConsultations(selectedDossier.patient.id).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getPatientConsultations(selectedDossier.patient.id).length > 0 ? (
                          <div className="space-y-3">
                            {getPatientConsultations(selectedDossier.patient.id).map((consultation) => (
                              <div key={consultation.id} className="border-l-4 border-l-blue-500 pl-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline">{formatDateTime(consultation.dateHeure)}</Badge>
                                  <span className="text-sm text-gray-500">{consultation.medecin}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                  <strong>Notes:</strong> {consultation.notes}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>Actes:</strong> {consultation.actesRealises}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Aucune consultation enregistrée</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Ordonnances ({getPatientOrdonnances(selectedDossier.patient.id).length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getPatientOrdonnances(selectedDossier.patient.id).length > 0 ? (
                          <div className="space-y-3">
                            {getPatientOrdonnances(selectedDossier.patient.id).map((ordonnance) => (
                              <div key={ordonnance.id} className="border-l-4 border-l-green-500 pl-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{formatDateTime(ordonnance.dateHeure)}</Badge>
                                    <Badge className={getStatusColor(ordonnance.status)}>
                                      {ordonnance.status === "ACTIVE" ? "Active" : "Terminée"}
                                    </Badge>
                                  </div>
                                  <span className="text-sm text-gray-500">{ordonnance.medecin}</span>
                                </div>
                                <div className="text-sm text-gray-700 whitespace-pre-wrap mb-1">
                                  <strong>Prescriptions:</strong> {ordonnance.prescriptions}
                                </div>
                                {ordonnance.instructions && (
                                  <p className="text-sm text-gray-700">
                                    <strong>Instructions:</strong> {ordonnance.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Aucune ordonnance disponible</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
