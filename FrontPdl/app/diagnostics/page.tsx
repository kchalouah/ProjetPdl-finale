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
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Calendar, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Diagnostic {
  id: number
  date: string // Will be mapped from dateHeure
  description: string
  consultationId: number
}

interface Consultation {
  id: number
  date: string
  patientId: number
  doctorId: number
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredDiagnostics, setFilteredDiagnostics] = useState<Diagnostic[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiagnostic, setEditingDiagnostic] = useState<Diagnostic | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    consultationId: "",
  })

  useEffect(() => {
    fetchDiagnostics()
    fetchConsultations()
  }, [])

  useEffect(() => {
    filterDiagnostics()
  }, [diagnostics, searchTerm])

  const fetchDiagnostics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/diagnostic/afficherdiagnostics")
      if (!response.ok) throw new Error("Erreur lors du chargement des diagnostics")
      const data = await response.json()
      // Map dateHeure to date (YYYY-MM-DD)
      const mapped = data.map((d: any) => ({
        ...d,
        date: d.dateHeure ? new Date(d.dateHeure).toISOString().slice(0, 10) : "",
        consultationId: d.consultation?.id ?? d.consultationId,
      }))
      setDiagnostics(mapped)
    } catch (error) {
      console.error("Erreur lors du chargement des diagnostics:", error)
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

  const filterDiagnostics = () => {
    let filtered = diagnostics
    if (searchTerm) {
      filtered = filtered.filter(
        (diagnostic) =>
          diagnostic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diagnostic.date.includes(searchTerm),
      )
    }
    setFilteredDiagnostics(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!formData.consultationId) {
        alert("Veuillez sélectionner une consultation.")
        setLoading(false)
        return
      }
      const diagnosticData = {
        date: formData.date,
        description: formData.description,
        consultationId: Number(formData.consultationId),
      }

      const response = await fetch(
        editingDiagnostic
          ? `/api/diagnostic/modifierdiagnostic/${editingDiagnostic.id}`
          : "/api/diagnostic/ajouterdiagnostic",
        {
          method: editingDiagnostic ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diagnosticData),
        },
      )

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde")

      await fetchDiagnostics()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde du diagnostic")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce diagnostic ?")) return

    try {
      const response = await fetch(`/api/diagnostic/supprimerdiagnostic/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      await fetchDiagnostics()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression du diagnostic")
    }
  }

  const handleEdit = (diagnostic: Diagnostic) => {
    setEditingDiagnostic(diagnostic)
    setFormData({
      date: diagnostic.date,
      description: diagnostic.description,
      consultationId: diagnostic.consultationId.toString(),
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      date: "",
      description: "",
      consultationId: "",
    })
    setEditingDiagnostic(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Diagnostics</h1>
            <p className="text-muted-foreground">Gérer les diagnostics médicaux</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Diagnostic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDiagnostic ? "Modifier le diagnostic" : "Nouveau diagnostic"}</DialogTitle>
              <DialogDescription>
                {editingDiagnostic ? "Modifiez les informations du diagnostic" : "Créez un nouveau diagnostic médical"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation">Consultation</Label>
                  <Select
                    value={formData.consultationId}
                    onValueChange={(value) => setFormData({ ...formData, consultationId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une consultation" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultations.map((consultation) => (
                        <SelectItem key={consultation.id} value={consultation.id.toString()}>
                          Consultation #{consultation.id} - {consultation.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée du diagnostic..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sauvegarde..." : editingDiagnostic ? "Modifier" : "Créer"}
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
              <CardTitle>Liste des diagnostics</CardTitle>
              <CardDescription>{filteredDiagnostics.length} diagnostic(s) trouvé(s)</CardDescription>
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
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Consultation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredDiagnostics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun diagnostic trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredDiagnostics.map((diagnostic) => (
                  <TableRow key={diagnostic.id}>
                    <TableCell className="font-medium">#{diagnostic.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {diagnostic.date
                          ? new Date(diagnostic.date).toLocaleDateString("fr-FR")
                          : ""}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{diagnostic.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Consultation #{diagnostic.consultationId}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(diagnostic)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(diagnostic.id)}
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