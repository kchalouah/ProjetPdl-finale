"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"

// Ajouter cette interface au début du fichier
interface User {
  id: number
  nom: string
  prenom: string
  role: string
}

interface Planning {
  id: number
  jour: string
  heureDebut: string
  heureFin: string
  utilisateur: string
  role: string
}

export default function PlanningPage() {
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlanning, setEditingPlanning] = useState<Planning | null>(null)
  const [userRole, setUserRole] = useState("")
  // Ajouter cet état
  const [users, setUsers] = useState<User[]>([])
  // Ajouter utilisateurId au formData initial
  const [formData, setFormData] = useState({
    jour: "",
    heureDebut: "",
    heureFin: "",
    utilisateur: "",
    utilisateurId: "",
  })

  const jours = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]

  // Ajouter cette fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/utilisateurs/tous")
      const data = await response.json()
      // Filtrer seulement le personnel (pas les patients)
      const staff = data.filter((user: User) => user.role !== "PATIENT")
      setUsers(staff)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
    }
  }

  // Modifier le useEffect pour appeler fetchUsers
  useEffect(() => {
    const role = localStorage.getItem("userRole") || ""
    setUserRole(role)
    fetchPlannings()
    fetchUsers()
  }, [])

  const fetchPlannings = async () => {
    try {
      // Simulation de données
      // const mockPlannings: Planning[] = [
      //   {
      //     id: 1,
      //     jour: "LUNDI",
      //     heureDebut: "08:00",
      //     heureFin: "16:00",
      //     utilisateur: "Dr. Dupont",
      //     role: "MEDECIN",
      //   },
      //   {
      //     id: 2,
      //     jour: "MARDI",
      //     heureDebut: "14:00",
      //     heureFin: "22:00",
      //     utilisateur: "Marie Martin",
      //     role: "INFIRMIER",
      //   },
      //   {
      //     id: 3,
      //     jour: "MERCREDI",
      //     heureDebut: "06:00",
      //     heureFin: "14:00",
      //     utilisateur: "Paul Moreau",
      //     role: "TECHNICIEN",
      //   },
      // ]
      // setPlannings(mockPlannings)
      const response = await fetch("/api/plannings/lister")
      const data = await response.json()
      setPlannings(data)
    } catch (error) {
      console.error("Erreur lors du chargement des plannings:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPlanning) {
        // setPlannings(
        //   plannings.map((p) =>
        //     p.id === editingPlanning.id ? { ...editingPlanning, ...formData, role: "MEDECIN" } : p,
        //   ),
        // )
        const response = await fetch(`/api/plannings/modifier/${editingPlanning.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...editingPlanning, ...formData }),
        })
      } else {
        const newPlanning: Planning = {
          id: Date.now(),
          ...formData,
          role: "MEDECIN",
        }
        // setPlannings([...plannings, newPlanning])
        const response = await fetch("/api/plannings/creer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlanning),
        })
      }
      resetForm()
      setIsDialogOpen(false)
      fetchPlannings()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  const handleEdit = (planning: Planning) => {
    setEditingPlanning(planning)
    setFormData({
      jour: planning.jour,
      heureDebut: planning.heureDebut,
      heureFin: planning.heureFin,
      utilisateur: planning.utilisateur,
      utilisateurId: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce planning ?")) {
      // setPlannings(plannings.filter((p) => p.id !== id))
      const response = await fetch(`/api/plannings/supprimer/${id}`, {
        method: "DELETE",
      })
      fetchPlannings()
    }
  }

  const resetForm = () => {
    setFormData({
      jour: "",
      heureDebut: "",
      heureFin: "",
      utilisateur: "",
      utilisateurId: "",
    })
    setEditingPlanning(null)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "MEDECIN":
        return "bg-blue-100 text-blue-800"
      case "INFIRMIER":
        return "bg-green-100 text-green-800"
      case "TECHNICIEN":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Planning du Personnel</h1>
                <p className="text-gray-600">Gérer les horaires de travail</p>
              </div>
            </div>

            {userRole === "ADMINISTRATEUR" && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Planning
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {editingPlanning ? "Modifier le planning" : "Nouveau planning"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingPlanning ? "Modifiez les horaires de travail" : "Créez un nouveau planning"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        {/* Remplacer le champ "Personnel" dans le formulaire par : */}
                        <div className="space-y-2">
                          <Label htmlFor="utilisateur">Personnel</Label>
                          <Select
                              value={formData.utilisateur}
                              onValueChange={(value) => {
                                const selectedUser = users.find((u) => u.id.toString() === value)
                                setFormData({
                                  ...formData,
                                  utilisateur: selectedUser ? `${selectedUser.prenom} ${selectedUser.nom}` : "",
                                  utilisateurId: value,
                                })
                              }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un membre du personnel" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.prenom} {user.nom} - {user.role}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jour">Jour</Label>
                          <Select
                              value={formData.jour}
                              onValueChange={(value) => setFormData({ ...formData, jour: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un jour" />
                            </SelectTrigger>
                            <SelectContent>
                              {jours.map((jour) => (
                                  <SelectItem key={jour} value={jour}>
                                    {jour}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="heureDebut">Heure de début</Label>
                            <Input
                                id="heureDebut"
                                type="time"
                                value={formData.heureDebut}
                                onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heureFin">Heure de fin</Label>
                            <Input
                                id="heureFin"
                                type="time"
                                value={formData.heureFin}
                                onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                                required
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">{editingPlanning ? "Modifier" : "Créer"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            )}
          </div>

          {/* Planning Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Planning Hebdomadaire ({plannings.length})
              </CardTitle>
              <CardDescription>
                {userRole === "ADMINISTRATEUR" ? "Plannings de tout le personnel" : "Mon planning de travail"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Jour</TableHead>
                    <TableHead>Horaires</TableHead>
                    {userRole === "ADMINISTRATEUR" && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plannings.map((planning) => (
                      <TableRow key={planning.id}>
                        <TableCell className="font-medium">{planning.utilisateur}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(planning.role)}>{planning.role}</Badge>
                        </TableCell>
                        <TableCell>{planning.jour}</TableCell>
                        <TableCell>
                          {planning.heureDebut} - {planning.heureFin}
                        </TableCell>
                        {userRole === "ADMINISTRATEUR" && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(planning)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(planning.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                        )}
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
