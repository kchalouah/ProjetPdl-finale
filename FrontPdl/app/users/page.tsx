"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface User {
    id: number
    nom: string
    prenom: string
    email: string
    role: string
    specialite?: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState("ALL")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
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
            if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs")
            const data = await response.json()
            const formattedUsers: User[] = data.map((user: any) => ({
                id: user.id,
                nom: user.nom || "",
                prenom: user.prenom || "",
                email: user.email || "",
                role: user.role || "",
                specialite: user.specialite || undefined,
            }))
            setUsers(formattedUsers)
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (selectedRole !== "ALL") {
            filtered = filtered.filter(user => user.role === selectedRole)
        }
        setFilteredUsers(filtered)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const userData = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                role: formData.role,
                specialite: formData.role === "MEDECIN" ? formData.specialite : null,
                dateNaissance: formData.role === "PATIENT" ? formData.dateNaissance : null,
                adresse: formData.role === "PATIENT" ? formData.adresse : null,
                telephone: formData.role === "PATIENT" ? formData.telephone : null,
                serviceId: formData.role === "TECHNICIEN" ? formData.serviceId : null,
                blocId: formData.role === "TECHNICIEN" ? formData.blocId : null,
            }
            const response = await fetch(
                editingUser ? `/api/utilisateurs/modifier/${editingUser.id}` : "/api/utilisateurs/creer",
                {
                    method: editingUser ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                }
            )
            if (!response.ok) throw new Error("Erreur lors de la sauvegarde")
            await fetchUsers()
            resetForm()
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error)
            alert("Erreur lors de la sauvegarde de l'utilisateur")
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
    }

    // 🆕 Affiche dynamiquement les champs spécifiques au rôle
    const renderRoleFields = () => {
        if (formData.role === "MEDECIN") {
            return (
                <div className="space-y-2">
                    <Label>Spécialité</Label>
                    <Select value={formData.specialite} onValueChange={(v) => setFormData({ ...formData, specialite: v })}>
                        <SelectTrigger><SelectValue placeholder="Spécialité" /></SelectTrigger>
                        <SelectContent>
                            {specialites.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
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
                        <Input type="date" value={formData.dateNaissance} onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                    </div>
                </>
            )
        } else if (formData.role === "TECHNICIEN") {
            return (
                <>
                    <div className="space-y-2">
                        <Label>ID du service</Label>
                        <Input value={formData.serviceId} onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })} />
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

    // ❗ assure-toi que ce code remplace l’ancien contenu du DialogContent
    return (
        <DialogContent>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Prénom</Label>
                        <Input value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <Label>Rôle</Label>
                    <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                        <SelectContent>
                            {roles.map((r) => (
                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {renderRoleFields()}

                <div className="space-y-2">
                    <Label>{editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}</Label>
                    <Input type="password" value={formData.motDePasse} onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })} required={!editingUser} />
                </div>

                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                    <Button type="submit">{editingUser ? "Modifier" : "Créer"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
