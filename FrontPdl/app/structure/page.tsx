"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, ArrowLeft, Building, Home, Bed } from "lucide-react"
import Link from "next/link"

interface Service {
  id: number
  nom: string
  blocsCount: number
}

interface Bloc {
  id: number
  numero: string
  serviceId: number
  serviceName: string
  chambresCount: number
}

interface Chambre {
  id: number
  numero: string
  capacite: number
  blocId: number
  blocNumero: string
  serviceName: string
}

export default function StructurePage() {
  const [services, setServices] = useState<Service[]>([])
  const [blocs, setBlocs] = useState<Bloc[]>([])
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [activeTab, setActiveTab] = useState("services")
  const [loading, setLoading] = useState(false)

  // Dialog states
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isBlocDialogOpen, setIsBlocDialogOpen] = useState(false)
  const [isChambreDialogOpen, setIsChambreDialogOpen] = useState(false)

  // Form states
  const [serviceForm, setServiceForm] = useState({ nom: "" })
  const [blocForm, setBlocForm] = useState({ numero: "", serviceId: "" })
  const [chambreForm, setChambreForm] = useState({ numero: "", capacite: "", blocId: "" })

  // Editing states
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingBloc, setEditingBloc] = useState<Bloc | null>(null)
  const [editingChambre, setEditingChambre] = useState<Chambre | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchServices(), fetchBlocs(), fetchChambres()])
  }

  const fetchServices = async () => {
    try {
      setLoading(true)
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/service/afficherservices")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des services")
      }
      const data = await response.json()

      const formattedServices: Service[] = data.map((service: any) => ({
        id: service.id,
        nom: service.nom || "",
        blocsCount: service.blocs?.length || 0,
      }))

      setServices(formattedServices)
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlocs = async () => {
    try {
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/bloc/afficherblocs")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des blocs")
      }
      const data = await response.json()

      const formattedBlocs: Bloc[] = data.map((bloc: any) => ({
        id: bloc.id,
        numero: bloc.numero || "",
        serviceId: bloc.service?.id || 0,
        serviceName: bloc.service?.nom || "Service inconnu",
        chambresCount: bloc.chambres?.length || 0,
      }))

      setBlocs(formattedBlocs)
    } catch (error) {
      console.error("Erreur lors du chargement des blocs:", error)
    }
  }

  const fetchChambres = async () => {
    try {
      // ✅ CORRECTION: Endpoint correct du backend
      const response = await fetch("/api/chambre/afficherchambres")
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des chambres")
      }
      const data = await response.json()

      const formattedChambres: Chambre[] = data.map((chambre: any) => ({
        id: chambre.id,
        numero: chambre.numero || "",
        capacite: chambre.capacite || 0,
        blocId: chambre.bloc?.id || 0,
        blocNumero: chambre.bloc?.numero || "Bloc inconnu",
        serviceName: chambre.bloc?.service?.nom || "Service inconnu",
      }))

      setChambres(formattedChambres)
    } catch (error) {
      console.error("Erreur lors du chargement des chambres:", error)
    }
  }

  // Service handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const serviceData = {
        nom: serviceForm.nom,
      }

      let response
      if (editingService) {
        // ✅ CORRECTION: Endpoint correct du backend
        response = await fetch(`/api/service/modifierservice/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        })
      } else {
        // ✅ CORRECTION: Endpoint correct du backend
        response = await fetch("/api/service/ajouterservice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        })
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      await fetchServices()
      resetServiceForm()
      setIsServiceDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du service:", error)
      alert("Erreur lors de la sauvegarde du service")
    } finally {
      setLoading(false)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({ nom: service.nom })
    setIsServiceDialogOpen(true)
  }

  const handleDeleteService = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setLoading(true)
      try {
        // ✅ CORRECTION: Endpoint correct du backend
        const response = await fetch(`/api/service/supprimerservice/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression")
        }

        await fetchData()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression du service")
      } finally {
        setLoading(false)
      }
    }
  }

  const resetServiceForm = () => {
    setServiceForm({ nom: "" })
    setEditingService(null)
  }

  // Bloc handlers
  const handleBlocSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const blocData = {
        numero: blocForm.numero,
      }

      let response
      if (editingBloc) {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètre
        response = await fetch(`/api/bloc/modifierbloc/${editingBloc.id}?serviceId=${blocForm.serviceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blocData),
        })
      } else {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètre
        response = await fetch(`/api/bloc/ajouterbloc?serviceId=${blocForm.serviceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blocData),
        })
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      await fetchBlocs()
      resetBlocForm()
      setIsBlocDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du bloc:", error)
      alert("Erreur lors de la sauvegarde du bloc")
    } finally {
      setLoading(false)
    }
  }

  const handleEditBloc = (bloc: Bloc) => {
    setEditingBloc(bloc)
    setBlocForm({ numero: bloc.numero, serviceId: bloc.serviceId.toString() })
    setIsBlocDialogOpen(true)
  }

  const handleDeleteBloc = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
      setLoading(true)
      try {
        // ✅ CORRECTION: Endpoint correct du backend
        const response = await fetch(`/api/bloc/supprimerbloc/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression")
        }

        await fetchData()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression du bloc")
      } finally {
        setLoading(false)
      }
    }
  }

  const resetBlocForm = () => {
    setBlocForm({ numero: "", serviceId: "" })
    setEditingBloc(null)
  }

  // Chambre handlers
  const handleChambreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const chambreData = {
        numero: chambreForm.numero,
        capacite: Number.parseInt(chambreForm.capacite),
      }

      let response
      if (editingChambre) {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètre
        response = await fetch(`/api/chambre/modifierchambre/${editingChambre.id}?blocId=${chambreForm.blocId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chambreData),
        })
      } else {
        // ✅ CORRECTION: Endpoint correct du backend avec paramètre
        response = await fetch(`/api/chambre/ajouterchambre?blocId=${chambreForm.blocId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chambreData),
        })
      }

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      await fetchChambres()
      resetChambreForm()
      setIsChambreDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la chambre:", error)
      alert("Erreur lors de la sauvegarde de la chambre")
    } finally {
      setLoading(false)
    }
  }

  const handleEditChambre = (chambre: Chambre) => {
    setEditingChambre(chambre)
    setChambreForm({
      numero: chambre.numero,
      capacite: chambre.capacite.toString(),
      blocId: chambre.blocId.toString(),
    })
    setIsChambreDialogOpen(true)
  }

  const handleDeleteChambre = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
      setLoading(true)
      try {
        // ✅ CORRECTION: Endpoint correct du backend
        const response = await fetch(`/api/chambre/supprimerchambre/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression")
        }

        await fetchChambres()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la chambre")
      } finally {
        setLoading(false)
      }
    }
  }

  const resetChambreForm = () => {
    setChambreForm({ numero: "", capacite: "", blocId: "" })
    setEditingChambre(null)
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
              <h1 className="text-3xl font-bold text-gray-900">Structure Hospitalière</h1>
              <p className="text-gray-600">Gérer les services, blocs et chambres</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">Services hospitaliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocs</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blocs.length}</div>
              <p className="text-xs text-muted-foreground">Blocs hospitaliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chambres</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chambres.length}</div>
              <p className="text-xs text-muted-foreground">Chambres disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="blocs">Blocs</TabsTrigger>
            <TabsTrigger value="chambres">Chambres</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Services Hospitaliers</CardTitle>
                  <CardDescription>Gérer les services de l'hôpital</CardDescription>
                </div>
                <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetServiceForm} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingService ? "Modifier le service" : "Nouveau service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleServiceSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceName">Nom du service</Label>
                          <Input
                            id="serviceName"
                            value={serviceForm.nom}
                            onChange={(e) => setServiceForm({ ...serviceForm, nom: e.target.value })}
                            placeholder="Ex: Cardiologie"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsServiceDialogOpen(false)}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Sauvegarde..." : editingService ? "Modifier" : "Créer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                        <TableHead>Nom du service</TableHead>
                        <TableHead>Nombre de blocs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.nom}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{service.blocsCount} blocs</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditService(service)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                disabled={loading}
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
          </TabsContent>

          {/* Blocs Tab */}
          <TabsContent value="blocs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Blocs Hospitaliers</CardTitle>
                  <CardDescription>Gérer les blocs par service</CardDescription>
                </div>
                <Dialog open={isBlocDialogOpen} onOpenChange={setIsBlocDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetBlocForm} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Bloc
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingBloc ? "Modifier le bloc" : "Nouveau bloc"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBlocSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="blocNumero">Numéro du bloc</Label>
                          <Input
                            id="blocNumero"
                            value={blocForm.numero}
                            onChange={(e) => setBlocForm({ ...blocForm, numero: e.target.value })}
                            placeholder="Ex: A1"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blocService">Service</Label>
                          <Select
                            value={blocForm.serviceId}
                            onValueChange={(value) => setBlocForm({ ...blocForm, serviceId: value })}
                            disabled={loading || !!editingBloc}
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
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsBlocDialogOpen(false)}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Sauvegarde..." : editingBloc ? "Modifier" : "Créer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                        <TableHead>Numéro</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Nombre de chambres</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blocs.map((bloc) => (
                        <TableRow key={bloc.id}>
                          <TableCell className="font-medium">{bloc.numero}</TableCell>
                          <TableCell>{bloc.serviceName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{bloc.chambresCount} chambres</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBloc(bloc)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBloc(bloc.id)}
                                disabled={loading}
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
          </TabsContent>

          {/* Chambres Tab */}
          <TabsContent value="chambres" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Chambres</CardTitle>
                  <CardDescription>Gérer les chambres par bloc</CardDescription>
                </div>
                <Dialog open={isChambreDialogOpen} onOpenChange={setIsChambreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetChambreForm} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Chambre
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingChambre ? "Modifier la chambre" : "Nouvelle chambre"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChambreSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="chambreNumero">Numéro de chambre</Label>
                          <Input
                            id="chambreNumero"
                            value={chambreForm.numero}
                            onChange={(e) => setChambreForm({ ...chambreForm, numero: e.target.value })}
                            placeholder="Ex: 101"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chambreCapacite">Capacité</Label>
                          <Input
                            id="chambreCapacite"
                            type="number"
                            min="1"
                            value={chambreForm.capacite}
                            onChange={(e) => setChambreForm({ ...chambreForm, capacite: e.target.value })}
                            placeholder="Nombre de lits"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chambreBloc">Bloc</Label>
                          <Select
                            value={chambreForm.blocId}
                            onValueChange={(value) => setChambreForm({ ...chambreForm, blocId: value })}
                            disabled={loading || !!editingChambre}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un bloc" />
                            </SelectTrigger>
                            <SelectContent>
                              {blocs.map((bloc) => (
                                <SelectItem key={bloc.id} value={bloc.id.toString()}>
                                  {bloc.numero} - {bloc.serviceName}
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
                          onClick={() => setIsChambreDialogOpen(false)}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Sauvegarde..." : editingChambre ? "Modifier" : "Créer"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                        <TableHead>Numéro</TableHead>
                        <TableHead>Bloc</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Capacité</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chambres.map((chambre) => (
                        <TableRow key={chambre.id}>
                          <TableCell className="font-medium">{chambre.numero}</TableCell>
                          <TableCell>{chambre.blocNumero}</TableCell>
                          <TableCell>{chambre.serviceName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{chambre.capacite} lits</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditChambre(chambre)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteChambre(chambre.id)}
                                disabled={loading}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
