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
import { Plus, Edit, Trash2, ArrowLeft, Settings, Search, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Equipement {
  id: number
  nom: string
  type: string
  modele: string
  numeroSerie: string
  localisation: string
  dateInstallation: string
  dateDerniereVerification: string
  dateProchaineMaintenance: string
  etat: "FONCTIONNEL" | "EN_MAINTENANCE" | "HORS_SERVICE"
  notes: string
}

interface Maintenance {
  id: number
  equipementId: number
  equipementNom: string
  dateIntervention: string
  type: "PREVENTIVE" | "CORRECTIVE" | "CALIBRATION"
  description: string
  technicien: string
  resultat: "SUCCES" | "ECHEC" | "EN_COURS"
}

export default function EquipementsPage() {
  const [equipements, setEquipements] = useState<Equipement[]>([])
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [filteredEquipements, setFilteredEquipements] = useState<Equipement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEtat, setSelectedEtat] = useState("ALL")
  const [activeTab, setActiveTab] = useState("equipements")
  const [isEquipementDialogOpen, setIsEquipementDialogOpen] = useState(false)
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)
  const [editingEquipement, setEditingEquipement] = useState<Equipement | null>(null)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [techniciens, setTechniciens] = useState([])

  const [equipementForm, setEquipementForm] = useState({
    nom: "",
    type: "",
    modele: "",
    numeroSerie: "",
    localisation: "",
    dateInstallation: "",
    dateDerniereVerification: "",
    dateProchaineMaintenance: "",
    etat: "FONCTIONNEL" as const,
    notes: "",
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    equipementId: "",
    dateIntervention: "",
    type: "PREVENTIVE" as const,
    description: "",
    resultat: "SUCCES" as const,
  })

  const etatOptions = [
    { value: "FONCTIONNEL", label: "Fonctionnel", color: "bg-green-100 text-green-800" },
    { value: "EN_MAINTENANCE", label: "En maintenance", color: "bg-yellow-100 text-yellow-800" },
    { value: "HORS_SERVICE", label: "Hors service", color: "bg-red-100 text-red-800" },
  ]

  const typeMaintenanceOptions = [
    { value: "PREVENTIVE", label: "Préventive" },
    { value: "CORRECTIVE", label: "Corrective" },
    { value: "CALIBRATION", label: "Calibration" },
    { value: "INSTALLATION", label: "Installation" },
    { value: "MISE_A_JOUR", label: "Mise à jour" },
  ]

  const resultatOptions = [
    { value: "SUCCES", label: "Succès", color: "bg-green-100 text-green-800" },
    { value: "ECHEC", label: "Échec", color: "bg-red-100 text-red-800" },
    { value: "EN_COURS", label: "En cours", color: "bg-yellow-100 text-yellow-800" },
    { value: "REPORTE", label: "Reporté", color: "bg-gray-100 text-gray-800" },
  ]

  const fetchTechniciens = async () => {
    try {
      const response = await fetch("/api/techniciens/lister")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des techniciens")
      }
      const data = await response.json()
      // Traiter les données des techniciens
      setTechniciens(data)
    } catch (error) {
      console.error("Erreur lors du chargement des techniciens:", error)
    }
  }

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || ""
    setUserEmail(email)
    fetchEquipements()
    fetchMaintenances()
    fetchTechniciens() // Ajouter cette ligne
  }, [])

  useEffect(() => {
    filterEquipements()
  }, [equipements, searchTerm, selectedEtat])

  const fetchEquipements = async () => {
    try {
      const response = await fetch("/api/equipement/getall")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des équipements")
      }
      const data = await response.json()

      // Transformer les données pour correspondre à notre interface Equipement
      const formattedEquipements: Equipement[] = data.map((equipement: any) => ({
        id: equipement.id,
        nom: equipement.nom || "",
        type: equipement.type || "",
        modele: equipement.modele || "",
        numeroSerie: equipement.numeroSerie || "",
        localisation: equipement.localisation || "",
        dateInstallation: equipement.dateInstallation || "",
        dateDerniereVerification: equipement.dateDerniereVerification || "",
        dateProchaineMaintenance: equipement.dateProchaineMaintenance || "",
        etat: equipement.etat || "FONCTIONNEL",
        notes: equipement.notes || "",
      }))

      setEquipements(formattedEquipements)
    } catch (error) {
      console.error("Erreur lors du chargement des équipements:", error)
    }
  }

  const fetchMaintenances = async () => {
    try {
      const response = await fetch("/api/maintenance/maint-get-all")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des maintenances")
      }
      const data = await response.json()

      // Transformer les données pour correspondre à notre interface Maintenance
      const formattedMaintenances: Maintenance[] = data.map((maintenance: any) => ({
        id: maintenance.id,
        equipementId: maintenance.equipement?.id || 0,
        equipementNom: maintenance.equipement?.nom || "Équipement inconnu",
        dateIntervention: maintenance.dateIntervention || "",
        type: maintenance.type || "PREVENTIVE",
        description: maintenance.description || "",
        technicien: maintenance.technicien?.nom + " " + maintenance.technicien?.prenom || "Technicien inconnu",
        resultat: maintenance.resultat || "EN_COURS",
      }))

      setMaintenances(formattedMaintenances)
    } catch (error) {
      console.error("Erreur lors du chargement des maintenances:", error)
    }
  }

  const filterEquipements = () => {
    let filtered = equipements

    if (searchTerm) {
      filtered = filtered.filter(
        (equipement) =>
          equipement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equipement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equipement.localisation.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedEtat !== "ALL") {
      filtered = filtered.filter((equipement) => equipement.etat === selectedEtat)
    }

    setFilteredEquipements(filtered)
  }

  // Gestion des équipements
  const handleEquipementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Préparer les données pour l'API
      const equipementData = {
        nom: equipementForm.nom,
        type: equipementForm.type,
        modele: equipementForm.modele,
        numeroSerie: equipementForm.numeroSerie,
        localisation: equipementForm.localisation,
        dateInstallation: equipementForm.dateInstallation,
        dateDerniereVerification: equipementForm.dateDerniereVerification,
        dateProchaineMaintenance: equipementForm.dateProchaineMaintenance,
        etat: equipementForm.etat,
        notes: equipementForm.notes,
      }

      let response

      if (editingEquipement) {
        // Mise à jour via l'API
        response = await fetch(`/api/equipement/modifier/${editingEquipement.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipementData),
        })
      } else {
        // Création via l'API
        response = await fetch("/api/equipement/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipementData),
        })
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de l'équipement")
      }

      // Recharger les équipements pour afficher les données à jour
      await fetchEquipements()

      resetEquipementForm()
      setIsEquipementDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'équipement:", error)
    }
  }

  const handleEditEquipement = (equipement: Equipement) => {
    setEditingEquipement(equipement)
    setEquipementForm({
      nom: equipement.nom,
      type: equipement.type,
      modele: equipement.modele,
      numeroSerie: equipement.numeroSerie,
      localisation: equipement.localisation,
      dateInstallation: equipement.dateInstallation,
      dateDerniereVerification: equipement.dateDerniereVerification,
      dateProchaineMaintenance: equipement.dateProchaineMaintenance,
      etat: equipement.etat,
      notes: equipement.notes,
    })
    setIsEquipementDialogOpen(true)
  }

  const handleDeleteEquipement = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
      try {
        const response = await fetch(`/api/equipement/supprimerequi/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'équipement")
        }

        // Recharger les équipements et les maintenances pour afficher les données à jour
        await fetchEquipements()
        await fetchMaintenances()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const resetEquipementForm = () => {
    setEquipementForm({
      nom: "",
      type: "",
      modele: "",
      numeroSerie: "",
      localisation: "",
      dateInstallation: "",
      dateDerniereVerification: "",
      dateProchaineMaintenance: "",
      etat: "FONCTIONNEL",
      notes: "",
    })
    setEditingEquipement(null)
  }

  // Gestion des maintenances
  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const equipementId = Number.parseInt(maintenanceForm.equipementId)
      const equipement = equipements.find((e) => e.id === equipementId)
      if (!equipement) return

      // Extraire l'ID du technicien (à adapter selon votre système d'authentification)
      const technicienId = 1 // ID du technicien connecté (à remplacer par une récupération réelle)

      // Préparer les données pour l'API
      const maintenanceData = {
        dateIntervention: maintenanceForm.dateIntervention,
        type: maintenanceForm.type,
        description: maintenanceForm.description,
        resultat: maintenanceForm.resultat,
        observations: "",
        dureeIntervention: 0,
        coutIntervention: 0,
      }

      let response

      if (editingMaintenance) {
        // Mise à jour via l'API
        response = await fetch(
          `/api/maintenance/mofidymaint/${editingMaintenance.id}?equipementId=${equipementId}&technicienId=${technicienId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(maintenanceData),
          },
        )
      } else {
        // Création via l'API
        response = await fetch(
          `/api/maintenance/ajoutermant/add?equipementId=${equipementId}&technicienId=${technicienId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(maintenanceData),
          },
        )
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de la maintenance")
      }

      // Recharger les maintenances et les équipements pour afficher les données à jour
      await fetchMaintenances()
      await fetchEquipements() // Pour mettre à jour les dates de maintenance

      resetMaintenanceForm()
      setIsMaintenanceDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la maintenance:", error)
    }
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance)
    setMaintenanceForm({
      equipementId: maintenance.equipementId.toString(),
      dateIntervention: maintenance.dateIntervention,
      type: maintenance.type,
      description: maintenance.description,
      resultat: maintenance.resultat,
    })
    setIsMaintenanceDialogOpen(true)
  }

  const handleDeleteMaintenance = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?")) {
      try {
        const response = await fetch(`/api/maintenance/supprimermant/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la maintenance")
        }

        // Recharger les maintenances pour afficher les données à jour
        await fetchMaintenances()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const resetMaintenanceForm = () => {
    setMaintenanceForm({
      equipementId: "",
      dateIntervention: "",
      type: "PREVENTIVE",
      description: "",
      resultat: "SUCCES",
    })
    setEditingMaintenance(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const getEtatBadge = (etat: string) => {
    const etatOption = etatOptions.find((option) => option.value === etat)
    return etatOption ? etatOption : etatOptions[0]
  }

  const getResultatBadge = (resultat: string) => {
    const resultatOption = resultatOptions.find((option) => option.value === resultat)
    return resultatOption ? resultatOption : resultatOptions[0]
  }

  const getMaintenanceTypeBadge = (type: string) => {
    switch (type) {
      case "PREVENTIVE":
        return "bg-blue-100 text-blue-800"
      case "CORRECTIVE":
        return "bg-orange-100 text-orange-800"
      case "CALIBRATION":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEquipementsEnAlerte = () => {
    const today = new Date()
    return equipements.filter((e) => {
      const dateProchaineMaintenance = new Date(e.dateProchaineMaintenance)
      const diffTime = dateProchaineMaintenance.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 15 || e.etat === "HORS_SERVICE"
    }).length
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Équipements</h1>
              <p className="text-gray-600">Suivi et maintenance du matériel médical</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipements.length}</div>
              <p className="text-xs text-muted-foreground">Équipements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fonctionnels</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipements.filter((e) => e.etat === "FONCTIONNEL").length}</div>
              <p className="text-xs text-muted-foreground">En service</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En maintenance</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipements.filter((e) => e.etat === "EN_MAINTENANCE").length}</div>
              <p className="text-xs text-muted-foreground">En cours de réparation</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getEquipementsEnAlerte()}</div>
              <p className="text-xs text-red-600">Maintenance requise</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "equipements"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("equipements")}
            >
              Équipements
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "maintenances"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("maintenances")}
            >
              Historique des maintenances
            </button>
          </div>
        </div>

        {activeTab === "equipements" && (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par nom, type ou localisation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedEtat} onValueChange={setSelectedEtat}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les états</SelectItem>
                      {etatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Equipements Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Équipements ({filteredEquipements.length})</CardTitle>
                  <CardDescription>Liste des équipements médicaux</CardDescription>
                </div>
                <Dialog open={isEquipementDialogOpen} onOpenChange={setIsEquipementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetEquipementForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel Équipement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        {editingEquipement ? "Modifier l'équipement" : "Nouvel équipement"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingEquipement
                          ? "Modifiez les informations de l'équipement"
                          : "Ajoutez un nouvel équipement médical"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEquipementSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom de l'équipement</Label>
                            <Input
                              id="nom"
                              value={equipementForm.nom}
                              onChange={(e) => setEquipementForm({ ...equipementForm, nom: e.target.value })}
                              placeholder="Ex: IRM 3T"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Input
                              id="type"
                              value={equipementForm.type}
                              onChange={(e) => setEquipementForm({ ...equipementForm, type: e.target.value })}
                              placeholder="Ex: Imagerie"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="modele">Modèle</Label>
                            <Input
                              id="modele"
                              value={equipementForm.modele}
                              onChange={(e) => setEquipementForm({ ...equipementForm, modele: e.target.value })}
                              placeholder="Ex: Siemens Magnetom Skyra"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="numeroSerie">Numéro de série</Label>
                            <Input
                              id="numeroSerie"
                              value={equipementForm.numeroSerie}
                              onChange={(e) => setEquipementForm({ ...equipementForm, numeroSerie: e.target.value })}
                              placeholder="Ex: SN12345678"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="localisation">Localisation</Label>
                          <Input
                            id="localisation"
                            value={equipementForm.localisation}
                            onChange={(e) => setEquipementForm({ ...equipementForm, localisation: e.target.value })}
                            placeholder="Ex: Service Radiologie - Salle 3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateInstallation">Date d'installation</Label>
                            <Input
                              id="dateInstallation"
                              type="date"
                              value={equipementForm.dateInstallation}
                              onChange={(e) =>
                                setEquipementForm({ ...equipementForm, dateInstallation: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateDerniereVerification">Dernière vérification</Label>
                            <Input
                              id="dateDerniereVerification"
                              type="date"
                              value={equipementForm.dateDerniereVerification}
                              onChange={(e) =>
                                setEquipementForm({ ...equipementForm, dateDerniereVerification: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateProchaineMaintenance">Prochaine maintenance</Label>
                            <Input
                              id="dateProchaineMaintenance"
                              type="date"
                              value={equipementForm.dateProchaineMaintenance}
                              onChange={(e) =>
                                setEquipementForm({ ...equipementForm, dateProchaineMaintenance: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="etat">État</Label>
                          <Select
                            value={equipementForm.etat}
                            onValueChange={(value: any) => setEquipementForm({ ...equipementForm, etat: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un état" />
                            </SelectTrigger>
                            <SelectContent>
                              {etatOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={equipementForm.notes}
                            onChange={(e) => setEquipementForm({ ...equipementForm, notes: e.target.value })}
                            placeholder="Informations complémentaires..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEquipementDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">{editingEquipement ? "Modifier" : "Créer"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Équipement</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Dernière vérification</TableHead>
                      <TableHead>Prochaine maintenance</TableHead>
                      <TableHead>État</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipements.map((equipement) => {
                      const etatBadge = getEtatBadge(equipement.etat)
                      const today = new Date()
                      const dateProchaineMaintenance = new Date(equipement.dateProchaineMaintenance)
                      const isUrgent = dateProchaineMaintenance < today || equipement.etat === "HORS_SERVICE"
                      const isWarning =
                        !isUrgent && dateProchaineMaintenance.getTime() - today.getTime() < 15 * 24 * 60 * 60 * 1000 // 15 jours

                      return (
                        <TableRow key={equipement.id}>
                          <TableCell>
                            <div className="font-medium">{equipement.nom}</div>
                            <div className="text-sm text-gray-500">
                              {equipement.modele} - {equipement.numeroSerie}
                            </div>
                          </TableCell>
                          <TableCell>{equipement.localisation}</TableCell>
                          <TableCell>{formatDate(equipement.dateDerniereVerification)}</TableCell>
                          <TableCell>
                            <div
                              className={`${
                                isUrgent ? "text-red-600 font-medium" : isWarning ? "text-yellow-600 font-medium" : ""
                              }`}
                            >
                              {formatDate(equipement.dateProchaineMaintenance)}
                              {isUrgent && <AlertTriangle className="inline-block ml-1 h-4 w-4 text-red-600" />}
                              {isWarning && <AlertTriangle className="inline-block ml-1 h-4 w-4 text-yellow-600" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={etatBadge.color}>{etatBadge.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      resetMaintenanceForm()
                                      setMaintenanceForm({
                                        ...maintenanceForm,
                                        equipementId: equipement.id.toString(),
                                        dateIntervention: new Date().toISOString().split("T")[0],
                                      })
                                    }}
                                  >
                                    <Settings className="h-4 w-4 mr-1" />
                                    Maintenance
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Settings className="h-5 w-5" />
                                      Nouvelle intervention de maintenance
                                    </DialogTitle>
                                    <DialogDescription>
                                      Enregistrez une nouvelle intervention sur cet équipement
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={handleMaintenanceSubmit}>
                                    <div className="grid gap-4 py-4">
                                      <div className="space-y-2">
                                        <Label>Équipement</Label>
                                        <Select
                                          value={maintenanceForm.equipementId}
                                          onValueChange={(value) =>
                                            setMaintenanceForm({ ...maintenanceForm, equipementId: value })
                                          }
                                          disabled={!!editingMaintenance}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un équipement" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {equipements.map((e) => (
                                              <SelectItem key={e.id} value={e.id.toString()}>
                                                {e.nom} - {e.localisation}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="dateIntervention">Date d'intervention</Label>
                                          <Input
                                            id="dateIntervention"
                                            type="date"
                                            value={maintenanceForm.dateIntervention}
                                            onChange={(e) =>
                                              setMaintenanceForm({
                                                ...maintenanceForm,
                                                dateIntervention: e.target.value,
                                              })
                                            }
                                            required
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="type">Type d'intervention</Label>
                                          <Select
                                            value={maintenanceForm.type}
                                            onValueChange={(value: any) =>
                                              setMaintenanceForm({ ...maintenanceForm, type: value })
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {typeMaintenanceOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                  {option.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="description">Description de l'intervention</Label>
                                        <Textarea
                                          id="description"
                                          value={maintenanceForm.description}
                                          onChange={(e) =>
                                            setMaintenanceForm({ ...maintenanceForm, description: e.target.value })
                                          }
                                          placeholder="Détails de l'intervention réalisée..."
                                          rows={4}
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="resultat">Résultat</Label>
                                        <Select
                                          value={maintenanceForm.resultat}
                                          onValueChange={(value: any) =>
                                            setMaintenanceForm({ ...maintenanceForm, resultat: value })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un résultat" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {resultatOptions.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsMaintenanceDialogOpen(false)}
                                      >
                                        Annuler
                                      </Button>
                                      <Button type="submit">Enregistrer</Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline" size="sm" onClick={() => handleEditEquipement(equipement)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteEquipement(equipement.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "maintenances" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Historique des Maintenances ({maintenances.length})</CardTitle>
                <CardDescription>Interventions techniques sur les équipements</CardDescription>
              </div>
              <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetMaintenanceForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {editingMaintenance ? "Modifier la maintenance" : "Nouvelle maintenance"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingMaintenance
                        ? "Modifiez les informations de la maintenance"
                        : "Enregistrez une nouvelle intervention"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleMaintenanceSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Équipement</Label>
                        <Select
                          value={maintenanceForm.equipementId}
                          onValueChange={(value) => setMaintenanceForm({ ...maintenanceForm, equipementId: value })}
                          disabled={!!editingMaintenance}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un équipement" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipements.map((e) => (
                              <SelectItem key={e.id} value={e.id.toString()}>
                                {e.nom} - {e.localisation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateIntervention">Date d'intervention</Label>
                          <Input
                            id="dateIntervention"
                            type="date"
                            value={maintenanceForm.dateIntervention}
                            onChange={(e) =>
                              setMaintenanceForm({ ...maintenanceForm, dateIntervention: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Type d'intervention</Label>
                          <Select
                            value={maintenanceForm.type}
                            onValueChange={(value: any) => setMaintenanceForm({ ...maintenanceForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeMaintenanceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description de l'intervention</Label>
                        <Textarea
                          id="description"
                          value={maintenanceForm.description}
                          onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                          placeholder="Détails de l'intervention réalisée..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resultat">Résultat</Label>
                        <Select
                          value={maintenanceForm.resultat}
                          onValueChange={(value: any) => setMaintenanceForm({ ...maintenanceForm, resultat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un résultat" />
                          </SelectTrigger>
                          <SelectContent>
                            {resultatOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Résultat</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenances.map((maintenance) => {
                    const resultatBadge = getResultatBadge(maintenance.resultat)
                    return (
                      <TableRow key={maintenance.id}>
                        <TableCell className="font-medium">{formatDate(maintenance.dateIntervention)}</TableCell>
                        <TableCell>{maintenance.equipementNom}</TableCell>
                        <TableCell>
                          <Badge className={getMaintenanceTypeBadge(maintenance.type)}>
                            {typeMaintenanceOptions.find((o) => o.value === maintenance.type)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{maintenance.description}</TableCell>
                        <TableCell>
                          <Badge className={resultatBadge.color}>{resultatBadge.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditMaintenance(maintenance)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteMaintenance(maintenance.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
