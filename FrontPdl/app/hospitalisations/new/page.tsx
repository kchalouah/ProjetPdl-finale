"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Edit, Trash2, PlusCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Patient {
  id: number
  nom: string
  prenom: string
  email: string
  dateNaissance: string
  adresse: string
  telephone: string
}

interface Service {
  id: number
  nom: string
}

interface Bloc {
  id: number
  nom: string
}

interface Chambre {
  id: number
  numero: string
}

interface Hospitalisation {
  id: number
  patient: Patient
  service: Service
  bloc: Bloc
  chambre: Chambre
  dateEntree: string
  dateSortie?: string
  motif: string
}

export default function HospitalisationsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blocs, setBlocs] = useState<Bloc[]>([])
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [hospitalisations, setHospitalisations] = useState<Hospitalisation[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")
  const [selectedBlocId, setSelectedBlocId] = useState<string>("")
  const [selectedChambreId, setSelectedChambreId] = useState<string>("")
  const [dateEntree, setDateEntree] = useState<Date | undefined>(undefined)
  const [dateSortie, setDateSortie] = useState<Date | undefined>(undefined)
  const [motif, setMotif] = useState<string>("")
  const [editingHospitalisationId, setEditingHospitalisationId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPatients()
    fetchServices()
    fetchBlocs()
    fetchChambres()
    fetchHospitalisations()
  }, [])

  const fetchPatients = async () => {
    try {
      console.log("=== RÉCUPÉRATION DES PATIENTS ===")
      console.log("Endpoint: http://localhost:8080/api/patients/lister")

      const response = await fetch("http://localhost:8080/api/patients/lister")
      console.log("Status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Patients récupérés:", data)
      console.log("Nombre de patients:", data.length)

      setPatients(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error)
      // Fallback vers l'API locale en cas d'erreur
      try {
        const fallbackResponse = await fetch("/api/patients")
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          console.log("Utilisation des données de fallback:", fallbackData)
          setPatients(fallbackData)
        }
      } catch (fallbackError) {
        console.error("Erreur fallback:", fallbackError)
      }
    }
  }

  const fetchServices = async () => {
    try {
      console.log("=== RÉCUPÉRATION DES SERVICES ===")
      console.log("Endpoint: http://localhost:8080/api/service/afficherservices")

      const response = await fetch("http://localhost:8080/api/service/afficherservices")
      console.log("Status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Services récupérés:", data)

      setServices(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error)
      // Fallback vers l'API locale
      try {
        const fallbackResponse = await fetch("/api/service/afficherservices")
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          setServices(fallbackData)
        }
      } catch (fallbackError) {
        console.error("Erreur fallback services:", fallbackError)
      }
    }
  }

  const fetchBlocs = async () => {
    try {
      console.log("=== RÉCUPÉRATION DES BLOCS ===")
      console.log("Endpoint: http://localhost:8080/api/bloc/afficherblocs")

      const response = await fetch("http://localhost:8080/api/bloc/afficherblocs")
      console.log("Status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Blocs récupérés:", data)

      setBlocs(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des blocs:", error)
    }
  }

  const fetchChambres = async () => {
    try {
      console.log("=== RÉCUPÉRATION DES CHAMBRES ===")
      console.log("Endpoint: http://localhost:8080/api/chambre/afficherchambres")

      const response = await fetch("http://localhost:8080/api/chambre/afficherchambres")
      console.log("Status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Chambres récupérées:", data)

      setChambres(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres:", error)
    }
  }

  const fetchHospitalisations = async () => {
    try {
      setLoading(true)
      console.log("=== RÉCUPÉRATION DES HOSPITALISATIONS ===")

      const response = await fetch("http://localhost:8080/api/hospitalisation/afficherhospitalisations")
      console.log("Status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Hospitalisations récupérées:", data)

      setHospitalisations(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des hospitalisations:", error)
    } finally {
      setLoading(false)
    }
  }

  const addHospitalisation = async () => {
    if (!selectedPatientId || !selectedServiceId || !selectedBlocId || !selectedChambreId || !dateEntree || !motif) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)

      const hospitalisationData = {
        dateEntree: dateEntree.toISOString().split("T")[0],
        dateSortie: dateSortie ? dateSortie.toISOString().split("T")[0] : null,
        motif: motif,
        patient: {
          id: Number.parseInt(selectedPatientId),
        },
        service: {
          id: Number.parseInt(selectedServiceId),
        },
        bloc: {
          id: Number.parseInt(selectedBlocId),
        },
        chambre: {
          id: Number.parseInt(selectedChambreId),
        },
      }

      console.log("=== AJOUT HOSPITALISATION ===")
      console.log("Patient sélectionné:", selectedPatientId)
      console.log("Service sélectionné:", selectedServiceId)
      console.log("Bloc sélectionné:", selectedBlocId)
      console.log("Chambre sélectionnée:", selectedChambreId)
      console.log("Date d'entrée:", dateEntree)
      console.log("Date de sortie:", dateSortie)
      console.log("Motif:", motif)
      console.log("Données finales envoyées:", hospitalisationData)

      const response = await fetch("http://localhost:8080/api/hospitalisation/ajouterhospitalisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospitalisationData),
      })

      console.log("Status:", response.status)

      if (response.status === 400) {
        const errorData = await response.json()
        if (errorData.errors && errorData.errors.length > 0) {
          // Display all error messages
          const errorMessages = errorData.errors.map((error: any) => error.message).join("\n")
          alert(`Erreur lors de l'ajout de l'hospitalisation:\n${errorMessages}`)
        } else {
          alert("Erreur lors de l'ajout de l'hospitalisation: Données invalides")
        }
        return
      }

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Erreur serveur:", errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Hospitalisation créée:", result)

      fetchHospitalisations()
      clearForm()
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'hospitalisation:", error)
      alert("Erreur lors de l'ajout de l'hospitalisation")
    } finally {
      setLoading(false)
    }
  }

  const updateHospitalisation = async (id: number) => {
    if (!selectedPatientId || !selectedServiceId || !selectedBlocId || !selectedChambreId || !dateEntree || !motif) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)

      const hospitalisationData = {
        dateEntree: dateEntree.toISOString().split("T")[0],
        dateSortie: dateSortie ? dateSortie.toISOString().split("T")[0] : null,
        motif: motif,
        patient: {
          id: Number.parseInt(selectedPatientId),
        },
        service: {
          id: Number.parseInt(selectedServiceId),
        },
        bloc: {
          id: Number.parseInt(selectedBlocId),
        },
        chambre: {
          id: Number.parseInt(selectedChambreId),
        },
      }

      const response = await fetch(`http://localhost:8080/api/hospitalisation/modifierhospitalisation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospitalisationData),
      })

      if (response.status === 400) {
        const errorData = await response.json()
        if (errorData.errors && errorData.errors.length > 0) {
          // Display all error messages
          const errorMessages = errorData.errors.map((error: any) => error.message).join("\n")
          alert(`Erreur lors de la modification de l'hospitalisation:\n${errorMessages}`)
        } else {
          alert("Erreur lors de la modification de l'hospitalisation: Données invalides")
        }
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHospitalisations()
      clearForm()
      setEditingHospitalisationId(null)
    } catch (error) {
      console.error("Erreur lors de la modification de l'hospitalisation:", error)
      alert("Erreur lors de la modification de l'hospitalisation")
    } finally {
      setLoading(false)
    }
  }

  const deleteHospitalisation = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette hospitalisation ?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/hospitalisation/supprimerhospitalisation/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHospitalisations()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'hospitalisation:", error)
      alert("Erreur lors de la suppression de l'hospitalisation")
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setSelectedPatientId("")
    setSelectedServiceId("")
    setSelectedBlocId("")
    setSelectedChambreId("")
    setDateEntree(undefined)
    setDateSortie(undefined)
    setMotif("")
    setShowForm(false)
  }

  const handleEdit = (hospitalisation: Hospitalisation) => {
    setEditingHospitalisationId(hospitalisation.id)
    setSelectedPatientId(hospitalisation.patient.id.toString())
    setSelectedServiceId(hospitalisation.service.id.toString())
    setSelectedBlocId(hospitalisation.bloc.id.toString())
    setSelectedChambreId(hospitalisation.chambre.id.toString())
    setDateEntree(hospitalisation.dateEntree ? new Date(hospitalisation.dateEntree) : undefined)
    setDateSortie(hospitalisation.dateSortie ? new Date(hospitalisation.dateSortie) : undefined)
    setMotif(hospitalisation.motif)
    setShowForm(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Hospitalisations</h1>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle hospitalisation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingHospitalisationId ? "Modifier l'hospitalisation" : "Nouvelle hospitalisation"}
              </DialogTitle>
              <DialogDescription>
                {editingHospitalisationId
                  ? "Modifiez les informations de l'hospitalisation"
                  : "Enregistrez une nouvelle hospitalisation"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.prenom} {patient.nom} - {patient.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {patients.length === 0 && <p className="text-sm text-muted-foreground">Aucun patient trouvé</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service *</Label>
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloc">Bloc *</Label>
                  <Select value={selectedBlocId} onValueChange={setSelectedBlocId}>
                    <SelectTrigger id="bloc">
                      <SelectValue placeholder="Sélectionner un bloc" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocs.map((bloc) => (
                        <SelectItem key={bloc.id} value={bloc.id.toString()}>
                          {bloc.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chambre">Chambre *</Label>
                  <Select value={selectedChambreId} onValueChange={setSelectedChambreId}>
                    <SelectTrigger id="chambre">
                      <SelectValue placeholder="Sélectionner une chambre" />
                    </SelectTrigger>
                    <SelectContent>
                      {chambres.map((chambre) => (
                        <SelectItem key={chambre.id} value={chambre.id.toString()}>
                          Chambre {chambre.numero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEntree">Date d'entrée *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="dateEntree">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateEntree ? format(dateEntree, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateEntree} onSelect={setDateEntree} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateSortie">Date de sortie (optionnelle)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="dateSortie">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateSortie ? format(dateSortie, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateSortie}
                        onSelect={setDateSortie}
                        initialFocus
                        disabled={(date) => (dateEntree ? date < dateEntree : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motif">Motif *</Label>
                <textarea
                  id="motif"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                  placeholder="Décrivez le motif de l'hospitalisation..."
                />
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={clearForm}>
                  Annuler
                </Button>
                <Button
                  onClick={() =>
                    editingHospitalisationId ? updateHospitalisation(editingHospitalisationId) : addHospitalisation()
                  }
                  disabled={loading}
                >
                  {loading ? "Chargement..." : editingHospitalisationId ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des hospitalisations</CardTitle>
          <CardDescription>
            Gérez les hospitalisations des patients ({hospitalisations.length} hospitalisation(s))
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : hospitalisations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">Aucune hospitalisation trouvée</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Bloc</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Date d'entrée</TableHead>
                  <TableHead>Date de sortie</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitalisations.map((hospitalisation) => (
                  <TableRow key={hospitalisation.id}>
                    <TableCell className="font-medium">
                      {hospitalisation.patient.prenom} {hospitalisation.patient.nom}
                    </TableCell>
                    <TableCell>{hospitalisation.service.nom}</TableCell>
                    <TableCell>{hospitalisation.bloc.nom}</TableCell>
                    <TableCell>Chambre {hospitalisation.chambre.numero}</TableCell>
                    <TableCell>{hospitalisation.dateEntree}</TableCell>
                    <TableCell>{hospitalisation.dateSortie || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={hospitalisation.motif}>
                      {hospitalisation.motif}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hospitalisation.dateSortie ? "outline" : "default"}>
                        {hospitalisation.dateSortie ? "Terminée" : "En cours"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(hospitalisation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteHospitalisation(hospitalisation.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
