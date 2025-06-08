"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: number
  nom: string
  prenom: string
}

interface Service {
  id: number
  nom: string
}

const NewHospitalisationPage = () => {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    serviceId: "",
    dateAdmission: "",
    dateSortie: "",
  })

  useEffect(() => {
    fetchPatients()
    fetchServices()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/patients")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/service/afficherservices")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const hospitalisationData = {
        patientId: parseInt(formData.patientId),
        serviceId: parseInt(formData.serviceId),
        dateAdmission: formData.dateAdmission,
        dateSortie: formData.dateSortie || null,
      }

      const response = await fetch("/api/hospitalisation/ajouterhospitalisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospitalisationData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Redirect to hospitalisations list
      router.push("/hospitalisations")
    } catch (error) {
      console.error("Failed to add hospitalisation:", error)
      alert("Erreur lors de l'ajout de l'hospitalisation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/hospitalisations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Hospitalisation</h1>
            <p className="text-gray-600">Créer une nouvelle hospitalisation</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'hospitalisation</CardTitle>
            <CardDescription>Veuillez remplir tous les champs obligatoires</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.nom} {patient.prenom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
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
                <Label htmlFor="dateAdmission">Date d'admission</Label>
                <Input
                  id="dateAdmission"
                  type="date"
                  value={formData.dateAdmission}
                  onChange={(e) => setFormData({ ...formData, dateAdmission: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateSortie">Date de sortie (optionnelle)</Label>
                <Input
                  id="dateSortie"
                  type="date"
                  value={formData.dateSortie}
                  onChange={(e) => setFormData({ ...formData, dateSortie: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/hospitalisations")} disabled={loading}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer l'hospitalisation"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewHospitalisationPage