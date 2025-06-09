"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Calendar,
  Hospital,
  Stethoscope,
  ClipboardList,
  UserCheck,
  Building,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Import the ApiStatus component at the top of the file
import { ApiStatus } from "@/components/api-status"

export default function Dashboard() {
  const [userRole, setUserRole] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    hospitalisations: 0,
    personnel: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (!role || !email) {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserEmail(email)

    // Simuler le chargement des statistiques
    setStats({
      patients: 1247,
      consultations: 89,
      hospitalisations: 23,
      personnel: 156,
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMINISTRATEUR":
        return "bg-red-100 text-red-800"
      case "MEDECIN":
        return "bg-blue-100 text-blue-800"
      case "INFIRMIER":
        return "bg-green-100 text-green-800"
      case "TECHNICIEN":
        return "bg-yellow-100 text-yellow-800"
      case "PATIENT":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMenuItems = () => {
    const baseItems = [
      { title: "Mon Profil", href: "/profile", icon: UserCheck, description: "Gérer mes informations personnelles" },
    ]

    switch (userRole) {
      case "ADMINISTRATEUR":
        return [
          ...baseItems,
          { title: "Gestion Utilisateurs", href: "/users", icon: Users, description: "Gérer les comptes utilisateurs" },
          {
            title: "Structure Hospitalière",
            href: "/structure",
            icon: Building,
            description: "Services, blocs et chambres",
          },
          { title: "Hospitalisations", href: "/hospitalisations", icon: Hospital, description: "Gérer les admissions" },
          {
            title: "Consultations",
            href: "/consultations",
            icon: Stethoscope,
            description: "Toutes les consultations",
          },
          { title: "Diagnostics", href: "/diagnostics", icon: ClipboardList, description: "Tous les diagnostics" },
          { title: "Ordonnances", href: "/ordonnances", icon: FileText, description: "Toutes les ordonnances" },
          { title: "Maintenance", href: "/maintenance", icon: Settings, description: "Gestion de la maintenance" },
          { title: "Équipements", href: "/equipements", icon: Settings, description: "Gestion des équipements" },
        ]

      case "MEDECIN":
        return [
          ...baseItems,
          {
            title: "Mes Consultations",
            href: "/consultations",
            icon: Stethoscope,
            description: "Gérer mes consultations",
          },
          { title: "Diagnostics", href: "/diagnostics", icon: ClipboardList, description: "Mes diagnostics" },
          { title: "Ordonnances", href: "/ordonnances", icon: FileText, description: "Prescrire des traitements" },
        ]

      case "INFIRMIER":
        return [
          ...baseItems,
          { title: "Consultations", href: "/consultations", icon: Stethoscope, description: "Voir les consultations" },
        ]

      case "TECHNICIEN":
        return [
          ...baseItems,
          { title: "Consultations", href: "/consultations", icon: Stethoscope, description: "Voir les consultations" },
          {
            title: "Équipements",
            href: "/equipements",
            icon: Settings,
            description: "Gestion des équipements médicaux",
          },
        ]

      case "PATIENT":
        return [
          ...baseItems,
          { title: "Mon Dossier Médical", href: "/mon-dossier", icon: FileText, description: "Consulter mon dossier" },
          {
            title: "Mes Consultations",
            href: "/mes-consultations",
            icon: Stethoscope,
            description: "Historique des consultations",
          },
        ]

      default:
        return baseItems
    }
  }

  if (!userRole) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Hospital className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">DMIC</h1>
              </div>
              <Badge className={getRoleColor(userRole)}>{userRole}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <ApiStatus />
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bonjour, {userEmail.split("@")[0]}</h2>
          <p className="text-gray-600">Bienvenue sur votre tableau de bord DMIC</p>
        </div>

        {/* Stats Cards - Only for Admin and Medical Staff */}
        {(userRole === "ADMINISTRATEUR" || userRole === "MEDECIN") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patients}</div>
                <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.consultations}</div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hospitalisations</CardTitle>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hospitalisations}</div>
                <p className="text-xs text-muted-foreground">Actuellement</p>
              </CardContent>
            </Card>

            {userRole === "ADMINISTRATEUR" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Personnel</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.personnel}</div>
                  <p className="text-xs text-muted-foreground">Membres actifs</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getMenuItems().map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions - Pas pour les patients */}
        {userRole !== "PATIENT" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accès direct aux fonctionnalités les plus utilisées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {userRole === "MEDECIN" && (
                  <>
                    <Button asChild>
                      <Link href="/consultations/new">Nouvelle Consultation</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/ordonnances/new">Nouvelle Ordonnance</Link>
                    </Button>
                  </>
                )}
                {userRole === "ADMINISTRATEUR" && (
                  <>
                    <Button asChild>
                      <Link href="/users/new">Nouvel Utilisateur</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/hospitalisations/new">Nouvelle Hospitalisation</Link>
                    </Button>
                  </>
                )}
                {(userRole === "ADMINISTRATEUR" ||
                  userRole === "MEDECIN" ||
                  userRole === "INFIRMIER" ||
                  userRole === "TECHNICIEN") && (
                  <Button variant="outline" asChild>
                    <Link href="/dossiers">Rechercher un Patient</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}