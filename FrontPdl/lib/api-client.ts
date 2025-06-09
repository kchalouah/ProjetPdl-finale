interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      }

      console.log(`API Request: ${config.method || "GET"} ${url}`)
      if (config.body) {
        console.log("Request body:", config.body)
      }

      const response = await fetch(url, config)

      let data: T | undefined
      let error: string | undefined

      if (response.ok) {
        try {
          data = await response.json()
        } catch (e) {
          // Response might be empty (e.g., 204 No Content)
          data = undefined
        }
      } else {
        try {
          const errorResponse = await response.text()
          error = errorResponse || `HTTP ${response.status}: ${response.statusText}`
        } catch (e) {
          error = `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        data,
        error,
        status: response.status,
      }
    } catch (err) {
      console.error("API request failed:", err)
      return {
        error: err instanceof Error ? err.message : "Network error",
        status: 0,
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Specific methods for common operations
  async getPatients() {
    return this.get<any[]>("/api/patients/afficherpatients")
  }

  async getMedecins() {
    return this.get<any[]>("/api/medecins/affichermedecins")
  }

  async getServices() {
    return this.get<any[]>("/api/services/afficherservices")
  }

  async getBlocs() {
    return this.get<any[]>("/api/bloc/afficherblocs")
  }

  async getChambres() {
    return this.get<any[]>("/api/chambre/afficherchambres")
  }

  async getDossiersMedicaux() {
    return this.get<any[]>("/api/dossiermedical/afficherdossiermedicals")
  }

  async getUtilisateurs() {
    return this.get<any[]>("/api/utilisateurs/tous")
  }

  async getInfirmiers() {
    return this.get<any[]>("/api/infirmiers/lister")
  }

  async getTechniciens() {
    return this.get<any[]>("/api/techniciens/lister")
  }

  // Create operations
  async createPlanning(data: any) {
    return this.post("/api/plannings/creer", data)
  }

  async createBloc(data: any) {
    return this.post("/api/bloc/ajouterbloc", data)
  }

  async createChambre(data: any) {
    return this.post("/api/chambre/ajouterchambre", data)
  }

  async createConsultation(data: any) {
    return this.post("/api/consultations/creer", data)
  }

  async createHospitalisation(data: any) {
    return this.post("/api/hospitalisations/creer", data)
  }

  // Assignment operations
  async affecterServiceToInfirmier(infirmierId: number, serviceId: number) {
    return this.put(`/api/infirmiers/affecter-service/${infirmierId}`, {
      service: { id: serviceId },
    })
  }

  async affecterBlocToInfirmier(infirmierId: number, blocId: number) {
    return this.put(`/api/infirmiers/affecter-bloc/${infirmierId}`, {
      bloc: { id: blocId },
    })
  }

  async affecterServiceToTechnicien(technicienId: number, serviceId: number) {
    return this.put(`/api/techniciens/affecter-service/${technicienId}`, {
      service: { id: serviceId },
    })
  }

  async affecterBlocToTechnicien(technicienId: number, blocId: number) {
    return this.put(`/api/techniciens/affecter-bloc/${technicienId}`, {
      bloc: { id: blocId },
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
