"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Edit, Trash2, Users, UserCheck, PlusCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
    id: number
    nom: string
    prenom: string
    email: string
    role: string
    specialite?: string
    dateNaissance?: string
    adresse?: string
    telephone?: string
    serviceId?: string
    blocId?: string
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState("ALL")
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        role: "",
        specialite: "",
        motDePasse: "",
        dateNaissance: "",
        adresse: "",
        telephone: "",
        serviceId: "",
        blocId: "",
    })

    const roles = [
        { value: "ADMINISTRATEUR", label: "Administrateur" },
        { value: "MEDECIN", label: "Médecin" },
        { value: "INFIRMIER", label: "Infirmier" },
        { value: "TECHNICIEN", label: "Technicien" },
        { value: "PATIENT", label: "Patient" },
    ]

    const specialites = [
        "CARDIOLOGIE",
        "DERMATOLOGIE",
        "GASTROENTEROLOGIE",
        "NEUROLOGIE",
        "OPHTALMOLOGIE",
        "PEDIATRIE",
        "PSYCHIATRIE",
        "RADIOLOGIE",
        "UROLOGIE",
        "GENERALISTE",
    ]

    // Fonction pour obtenir la couleur du badge selon le rôle
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMINISTRATEUR":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "MEDECIN":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "INFIRMIER":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "TECHNICIEN":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            case "PATIENT":
                return "bg-orange-100 text-orange-800 hover:bg-orange-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchTerm, selectedRole])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/utilisateurs/tous")
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users
        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }
        if (selectedRole !== "ALL") {
            filtered = filtered.filter((user) => user.role === selectedRole)
        }
        setFilteredUsers(filtered)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validation des champs obligatoires pour les patients
            if (formData.role === "PATIENT") {
                if (!formData.adresse.trim() || !formData.telephone.trim() || !formData.dateNaissance) {
                    alert("Tous les champs du patient doivent être remplis.")
                    setLoading(false)
                    return
                }
            }

            // Préparation des données selon le type d'utilisateur
            let userData: any = {
                nom: formData.nom.trim(),
                prenom: formData.prenom.trim(),
                email: formData.email.trim(),
                motDePasse: formData.motDePasse,
                role: formData.role,
            }

            // Déterminer l'endpoint selon le rôle
            let endpoint = ""

            // Ajout des champs spécifiques selon le rôle
            if (formData.role === "PATIENT") {
                // Validation spécifique pour les patients
                if (!formData.dateNaissance || !formData.adresse.trim() || !formData.telephone.trim()) {
                    throw new Error("Tous les champs du patient sont obligatoires")
                }

                // Validation de la date
                const birthDate = new Date(formData.dateNaissance)
                if (isNaN(birthDate.getTime())) {
                    throw new Error("Date de naissance invalide")
                }

                // Format de date pour Java Date (timestamp)
                userData = {
                    nom: formData.nom.trim(),
                    prenom: formData.prenom.trim(),
                    email: formData.email.trim(),
                    motDePasse: formData.motDePasse,
                    role: formData.role,
                    dateNaissance: formData.dateNaissance, // Keep as YYYY-MM-DD string
                    adresse: formData.adresse.trim(),
                    telephone: formData.telephone.trim(),
                    type: "patient", // Add the type field for proper deserialization
                }
                endpoint = "/api/patients/creer"
            } else if (formData.role === "MEDECIN") {
                if (formData.specialite) {
                    userData.specialite = formData.specialite
                }
                userData.type = "medecin" // Add the type field
                endpoint = "/api/medecin/ajoutermedecin"
            } else if (formData.role === "TECHNICIEN") {
                if (formData.serviceId) userData.serviceId = formData.serviceId
                if (formData.blocId) userData.blocId = formData.blocId
                userData.type = "technicien" // Add the type field
                endpoint = "/api/techniciens/creer"
            } else if (formData.role === "INFIRMIER") {
                userData.type = "infirmier" // Add the type field
                endpoint = "/api/infirmier/ajouterinfirmier"
            } else if (formData.role === "ADMINISTRATEUR") {
                userData.type = "administrateur" // Add the type field
                endpoint = "/api/admin/ajouteradmin"
            }

            // Si on édite un utilisateur existant
            if (editingUser) {
                endpoint = `/api/utilisateurs/modifier/${editingUser.id}`
            }

            console.log("=== DONNÉES ENVOYÉES ===")
            console.log("Endpoint:", endpoint)
            console.log("Méthode:", editingUser ? "PUT" : "POST")
            console.log("Données:", JSON.stringify(userData, null, 2))
            console.log("========================")

            const response = await fetch(endpoint, {
                method: editingUser ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(userData),
            })

            console.log("=== RÉPONSE SERVEUR ===")
            console.log("Status:", response.status)
            console.log("Status Text:", response.statusText)
            console.log("Headers:", Object.fromEntries(response.headers.entries()))

            // Lire la réponse une seule fois
            const responseText = await response.text()
            console.log("Response Body:", responseText)
            console.log("======================")

            if (!response.ok) {
                let errorMessage = `Erreur ${response.status}: ${response.statusText}`

                try {
                    const errorData = JSON.parse(responseText)
                    if (errorData.message) {
                        errorMessage = errorData.message
                    } else if (errorData.error) {
                        errorMessage = errorData.error
                    } else if (typeof errorData === "string") {
                        errorMessage = errorData
                    }
                } catch (parseError) {
                    // Si ce n'est pas du JSON, utiliser le texte brut
                    if (responseText) {
                        errorMessage = responseText
                    }
                }

                throw new Error(errorMessage)
            }

            // Succès
            await fetchUsers()
            resetForm()
            setShowForm(false)
            alert("Utilisateur créé avec succès !")
        } catch (error) {
            console.error("=== ERREUR DÉTAILLÉE ===")
            console.error("Type d'erreur:", typeof error)
            console.error("Message:", error instanceof Error ? error.message : String(error))
            console.error("Stack:", error instanceof Error ? error.stack : "N/A")
            console.error("========================")

            const errorMessage = error instanceof Error ? error.message : String(error)
            alert(`Erreur lors de la sauvegarde: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            specialite: user.specialite || "",
            motDePasse: "",
            dateNaissance: user.dateNaissance || "",
            adresse: user.adresse || "",
            telephone: user.telephone || "",
            serviceId: user.serviceId || "",
            blocId: user.blocId || "",
        })
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            return
        }

        try {
            setLoading(true)
            const response = await fetch(`/api/utilisateurs/supprimer/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Erreur lors de la suppression")
            await fetchUsers()
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            alert("Erreur lors de la suppression de l'utilisateur")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            nom: "",
            prenom: "",
            email: "",
            role: "",
            specialite: "",
            motDePasse: "",
            dateNaissance: "",
            adresse: "",
            telephone: "",
            serviceId: "",
            blocId: "",
        })
        setEditingUser(null)
        setShowForm(false)
    }

    const renderRoleFields = () => {
        if (formData.role === "MEDECIN") {
            return (
                <div className="space-y-2">
                    <Label>Spécialité</Label>
                    <Select value={formData.specialite} onValueChange={(v) => setFormData({ ...formData, specialite: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                            {specialites.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )
        } else if (formData.role === "PATIENT") {
            return (
                <>
                    <div className="space-y-2">
                        <Label>Date de naissance</Label>
                        <Input
                            type="date"
                            value={formData.dateNaissance}
                            onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        />
                    </div>
                </>
            )
        } else if (formData.role === "TECHNICIEN") {
            return (
                <>
                    <div className="space-y-2">
                        <Label>ID du service</Label>
                        <Input
                            value={formData.serviceId}
                            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>ID du bloc</Label>
                        <Input value={formData.blocId} onChange={(e) => setFormData({ ...formData, blocId: e.target.value })} />
                    </div>
                </>
            )
        }
        return null
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Utilisateurs</h1>
                        <p className="text-muted-foreground">Gérer les utilisateurs du système</p>
                    </div>
                </div>
                <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau utilisateur
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prénom</Label>
                                    <Input
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rôle</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(v) =>
                                        setFormData({
                                            ...formData,
                                            role: v,
                                            specialite: "",
                                            dateNaissance: "",
                                            adresse: "",
                                            telephone: "",
                                            serviceId: "",
                                            blocId: "",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.value} value={r.value}>
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {renderRoleFields()}
                            <div className="space-y-2">
                                <Label>{editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</Label>
                                <Input
                                    type="password"
                                    value={formData.motDePasse}
                                    onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                                    required={!editingUser}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Sauvegarde..." : editingUser ? "Modifier" : "Créer"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" /> Liste des utilisateurs
                            </CardTitle>
                            <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tous les rôles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Spécialité</TableHead>
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
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Aucun utilisateur trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {user.prenom} {user.nom}
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {roles.find((r) => r.value === user.role)?.label || user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.specialite ? (
                                                <Badge variant="outline">{user.specialite}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
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
