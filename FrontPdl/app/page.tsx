"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Shield, Users, Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const userEmail = localStorage.getItem("userEmail")

    if (userRole && userEmail) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          motDePasse: password,
        }),
        credentials: "include", // ⚠️ Nécessaire pour activer les cookies de session
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Récupérer le rôle depuis la réponse
        const userRole = data.role

        // Stocker les informations utilisateur
        localStorage.setItem("userRole", userRole)
        localStorage.setItem("userEmail", email)

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }

        router.push("/dashboard")
      } else {
        setError(data.message || "Erreur de connexion")
      }
    } catch (err) {
      console.error("Erreur de connexion:", err)
      setError("Impossible de se connecter au serveur. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Section gauche - Informations */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">DMIC</h1>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dossier Médical Collaboratif</h2>
            <p className="text-xl text-gray-600 mb-8">
              Plateforme moderne de gestion des dossiers médicaux pour une collaboration efficace entre professionnels
              de santé
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Sécurisé et Confidentiel</h3>
                <p className="text-gray-600">
                  Vos données médicales sont protégées par les plus hauts standards de sécurité
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Collaboration Médicale</h3>
                <p className="text-gray-600">Facilitez la communication entre médecins, infirmiers et techniciens</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Gestion Complète</h3>
                <p className="text-gray-600">Consultations, diagnostics, ordonnances et planning centralisés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire de connexion */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Accédez à votre espace professionnel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@hopital.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Se souvenir de moi
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="link" asChild className="text-sm text-gray-600">
                <Link href="/forgot-password">Mot de passe oublié ?</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
