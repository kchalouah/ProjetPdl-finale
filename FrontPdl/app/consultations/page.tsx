"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowLeft, Search, Stethoscope } from "lucide-react"
import Link from "next/link"

interface Consultation {
  id: number
  dateHeure: string
  notes: string
  actesRealises: string
  medecin: string
  medecinId: number
  patient: string
  dossierMedicalId: number
  specialite: string
}

interface DossierMedical {
  id: number
  patient: string
}

interface Medecin {
  id: number
  nom: string
  prenom: string
  specialite: string
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [dossiersMedicaux, setDossiersMedicaux] = useState<DossierMedical[]>([])
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null)
  const [userRole, setUserRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    dateHeure: "",
    notes: "",
    actesRealises: "",
    dossierMedicalId: "",
    medecinId: "",
  })

  useEffect(() => {
    const role = localStorage.getItem("userRole") || ""
    setUserRole(role)
    fetchConsultations()
    fetchDossiersMedicaux()
    fetchMedecins()
  }, [])

  useEffect(() => {
    filterConsultations()
  }, [consultations, searchTerm])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/consultations/lister")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des consultations")
      }
      const data = await response.json()

      const formattedConsultations: Consultation[] = data.map((consultation: any) => ({
        id: consultation.id,
        dateHeure: consultation.dateHeure || "",
        notes: consultation.notes || "",
        actesRealises: consultation.actesRealises || "",
        medecin: consultation.medecin?.nom + " " + consultation.medecin?.prenom || "Médecin inconnu",
        medecinId: consultation.medecin?.id || 0,
        patient:
          consultation.dossierMedical?.patient?.nom + " " + consultation.dossierMedical?.patient?.prenom ||
          "Patient inconnu",
        dossierMedicalId: consultation.dossierMedical?.id || 0,
        specialite: consultation.medecin?.specialite || "Généraliste",
      }))

      setConsultations(formattedConsultations)
    } catch (error) {
      console.error("Erreur lors du chargement des consultations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDossiersMedicaux = async () => {
    try {
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/dossiermedical/afficherdossiermedicals")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des dossiers médicaux")
      }
      const data = await response.json()

      const formattedDossiers: DossierMedical[] = data.map((dossier: any) => ({
        id: dossier.id,
        patient: dossier.patient?.nom + " " + dossier.patient?.prenom || "Patient inconnu",
      }))

      setDossiersMedicaux(formattedDossiers)
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers médicaux:", error)
    }
  }

  const fetchMedecins = async () => {
    try {
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/medecin/affichermedecins")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des médecins")
      }
      const data = await response.json()

      const formattedMedecins: Medecin[] = data.map((medecin: any) => ({
        id: medecin.id,
        nom: medecin.nom || "",
        prenom: medecin.prenom || "",
        specialite: medecin.specialite || "Généraliste",
      }))

      setMedecins(formattedMedecins)
    } catch (error) {
      console.error("Erreur lors du chargement des médecins:", error)
    }
  }

  const filterConsultations = () => {
    let filtered = consultations

    if (searchTerm) {
      filtered = filtered.filter(
        (consultation) =>
          consultation.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.medecin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.notes.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredConsultations(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const consultationData = {
        dateHeure: formData.dateHeure,
        notes: formData.notes,
        actesRealises: formData.actesRealises,
        medecin: { id: Number.parseInt(formData.medecinId) }, // ✅ CORRECTION: Format attendu par le backend
        dossierMedical: { id: Number.parseInt(formData.dossierMedicalId) }, // ✅ CORRECTION: Format attendu par le backend
      }

      let response
      if (editingConsultation) {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètres
        response = await fetch(
          `/api/consultations/modifier/${editingConsultation.id}?medecinId=${formData.medecinId}&dossierMedicalId=${formData.dossierMedicalId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dateHeure: formData.dateHeure,
              notes: formData.notes,
              actesRealises: formData.actesRealises,
            }),
          },
        )
      } else {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètres
        response = await fetch(
          `/api/consultations/creer?medecinId=${formData.medecinId}&dossierMedicalId=${formData.dossierMedicalId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dateHeure: formData.dateHeure,
              notes: formData.notes,
              actesRealises: formData.actesRealises,
            }),
          },
        )
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      await fetchConsultations()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde de la consultation")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation)
    setFormData({
      dateHeure: consultation.dateHeure.slice(0, 16),
      notes: consultation.notes,
      actesRealises: consultation.actesRealises,
      dossierMedicalId: consultation.dossierMedicalId.toString(),
      medecinId: consultation.medecinId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette consultation ?")) {
      setLoading(true)
      try {
        // ✅ CORRECTION: Endpoint correct du backend
        const response = await fetch(`/api/consultations/supprimer/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression")
        }

        await fetchConsultations()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la consultation")
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      dateHeure: "",
      notes: "",
      actesRealises: "",
      dossierMedicalId: "",
      medecinId: "",
    })
    setEditingConsultation(null)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR")
  }

  const getSpecialiteColor = (specialite: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ]
    return colors[specialite.length % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
              <p className="text-gray-600">
                {userRole === "ADMINISTRATEUR" ? "Toutes les consultations" : "Mes consultations"}
              </p>
            </div>
          </div>

          {(userRole === "MEDECIN" || userRole === "ADMINISTRATEUR") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Consultation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {editingConsultation ? "Modifier la consultation" : "Nouvelle consultation"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingConsultation
                      ? "Modifiez les informations de la consultation"
                      : "Enregistrez une nouvelle consultation"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateHeure">Date et heure</Label>
                      <Input
                        id="dateHeure"
                        type="datetime-local"
                        value={formData.dateHeure}
                        onChange={(e) => setFormData({ ...formData, dateHeure: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dossierMedical">Patient</Label>
                        <Select
                          value={formData.dossierMedicalId}
                          onValueChange={(value) => setFormData({ ...formData, dossierMedicalId: value })}
                          disabled={loading || !!editingConsultation}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {dossiersMedicaux.map((dossier) => (
                              <SelectItem key={dossier.id} value={dossier.id.toString()}>
                                {dossier.patient}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medecin">Médecin</Label>
                        <Select
                          value={formData.medecinId}
                          onValueChange={(value) => setFormData({ ...formData, medecinId: value })}
                          disabled={loading || !!editingConsultation}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un médecin" />
                          </SelectTrigger>
                          <SelectContent>
                            {medecins.map((medecin) => (
                              <SelectItem key={medecin.id} value={medecin.id.toString()}>
                                Dr. {medecin.prenom} {medecin.nom} - {medecin.specialite}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes de consultation</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Observations et notes de la consultation..."
                        rows={4}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actesRealises">Actes réalisés</Label>
                      <Textarea
                        id="actesRealises"
                        value={formData.actesRealises}
                        onChange={(e) => setFormData({ ...formData, actesRealises: e.target.value })}
                        placeholder="Liste des actes médicaux réalisés..."
                        rows={3}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sauvegarde..." : editingConsultation ? "Modifier" : "Créer"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultations.length}</div>
              <p className="text-xs text-muted-foreground">Consultations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {consultations.filter((c) => new Date(c.dateHeure).getMonth() === new Date().getMonth()).length}
              </div>
              <p className="text-xs text-muted-foreground">Janvier 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {consultations.filter((c) => new Date(c.dateHeure).toDateString() === new Date().toDateString()).length}
              </div>
              <p className="text-xs text-muted-foreground">Consultations du jour</p>
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
                placeholder="Rechercher par patient, médecin ou notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Consultations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Consultations ({filteredConsultations.length})</CardTitle>
            <CardDescription>Liste des consultations médicales</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Chargement...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Notes</TableHead>
                    {(userRole === "MEDECIN" || userRole === "ADMINISTRATEUR") && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">{formatDateTime(consultation.dateHeure)}</TableCell>
                      <TableCell>{consultation.patient}</TableCell>
                      <TableCell>{consultation.medecin}</TableCell>
                      <TableCell>
                        <Badge className={getSpecialiteColor(consultation.specialite)}>{consultation.specialite}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="space-y-1">
                          <p className="text-sm truncate">{consultation.notes}</p>
                          {consultation.actesRealises && (
                            <p className="text-xs text-gray-500 truncate">Actes: {consultation.actesRealises}</p>
                          )}
                        </div>
                      </TableCell>
                      {(userRole === "MEDECIN" || userRole === "ADMINISTRATEUR") && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(consultation)}
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(consultation.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
