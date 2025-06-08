"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Search, Edit, Trash2, Calendar, Pill } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Ordonnance {
  id: number
  consultation_id: number
  medicaments: string
  instructions: string
  date_prescription: string
}

interface Consultation {
  id: number
  patient_id: number
  date_consultation: string
  motif: string
  diagnostique: string
}

export default function OrdonnancesPage() {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredOrdonnances, setFilteredOrdonnances] = useState<Ordonnance[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrdonnance, setEditingOrdonnance] = useState<Ordonnance | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    consultation_id: "",
    medicaments: "",
    instructions: "",
  })

  useEffect(() => {
    fetchOrdonnances()
    fetchConsultations()
  }, [])

  useEffect(() => {
    filterOrdonnances()
  }, [ordonnances, searchTerm])

  const fetchOrdonnances = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ordonnances/afficherordonnances")
      if (!response.ok) throw new Error("Erreur lors du chargement des ordonnances")
      const data = await response.json()
      setOrdonnances(data)
    } catch (error) {
      console.error("Erreur lors du chargement des ordonnances:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/consultations/lister")
      if (!response.ok) throw new Error("Erreur lors du chargement des consultations")
      const data = await response.json()
      setConsultations(data)
    } catch (error) {
      console.error("Erreur lors du chargement des consultations:", error)
    }
  }

  const filterOrdonnances = () => {
    let filtered = ordonnances
    if (searchTerm) {
      filtered = filtered.filter(
          (ordonnance) =>
              ordonnance.medicaments.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ordonnance.instructions.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredOrdonnances(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consultation_id || !formData.medicaments || !formData.instructions) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    setLoading(true)
    try {
      const ordonnanceData = {
        consultation_id: Number.parseInt(formData.consultation_id),
        medicaments: formData.medicaments,
        instructions: formData.instructions,
      }

      const response = await fetch(
          editingOrdonnance
              ? `/api/ordonnances/modifierordonnance/${editingOrdonnance.id}`
              : "/api/ordonnances/ajouterordonnance",
          {
            method: editingOrdonnance ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ordonnanceData),
          },
      )

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde")

      await fetchOrdonnances()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde de l'ordonnance")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ordonnance ?")) return

    try {
      const response = await fetch(`/api/ordonnances/supprimerordonnance/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      await fetchOrdonnances()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression de l'ordonnance")
    }
  }

  const handleEdit = (ordonnance: Ordonnance) => {
    setEditingOrdonnance(ordonnance)
    setFormData({
      consultation_id: ordonnance.consultation_id.toString(),
      medicaments: ordonnance.medicaments,
      instructions: ordonnance.instructions,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      consultation_id: "",
      medicaments: "",
      instructions: "",
    })
    setEditingOrdonnance(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ordonnances</h1>
            <p className="text-muted-foreground">Gérer les prescriptions médicales</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Ordonnance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingOrdonnance ? "Modifier l'ordonnance" : "Nouvelle ordonnance"}</DialogTitle>
                <DialogDescription>
                  {editingOrdonnance
                      ? "Modifiez les informations de l'ordonnance"
                      : "Créez une nouvelle prescription médicale"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultation">Consultation</Label>
                  <Select
                      value={formData.consultation_id}
                      onValueChange={(value) => setFormData({ ...formData, consultation_id: value })}
                      disabled={!!editingOrdonnance}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une consultation" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultations.map((consultation) => (
                          <SelectItem key={consultation.id} value={consultation.id.toString()}>
                            Consultation #{consultation.id} - Patient #{consultation.patient_id} -{" "}
                            {consultation.date_consultation}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicaments">Médicaments</Label>
                  <Textarea
                      id="medicaments"
                      placeholder="Liste des médicaments prescrits..."
                      value={formData.medicaments}
                      onChange={(e) => setFormData({ ...formData, medicaments: e.target.value })}
                      rows={3}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                      id="instructions"
                      placeholder="Instructions de prise et posologie..."
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      rows={4}
                      required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sauvegarde..." : editingOrdonnance ? "Modifier" : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des ordonnances</CardTitle>
                <CardDescription>{filteredOrdonnances.length} ordonnance(s) trouvée(s)</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Consultation</TableHead>
                  <TableHead>Médicaments</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Chargement...
                      </TableCell>
                    </TableRow>
                ) : filteredOrdonnances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucune ordonnance trouvée
                      </TableCell>
                    </TableRow>
                ) : (
                    filteredOrdonnances.map((ordonnance) => (
                        <TableRow key={ordonnance.id}>
                          <TableCell className="font-medium">#{ordonnance.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Consultation #{ordonnance.consultation_id}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-start">
                              <Pill className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="truncate">{ordonnance.medicaments}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{ordonnance.instructions}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {new Date(ordonnance.date_prescription).toLocaleDateString("fr-FR")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(ordonnance)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(ordonnance.id)}
                                  className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}
