"use client"

import { useState, useEffect } from "react"

interface Patient {
  id: number
  nom: string
  prenom: string
  // ... other patient properties
}

interface Service {
  id: number
  nom: string
  // ... other service properties
}

interface Hospitalisation {
  id: number
  patientId: number
  serviceId: number
  dateAdmission: string
  dateSortie?: string
  // ... other hospitalisation properties
}

const HospitalisationsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [hospitalisations, setHospitalisations] = useState<Hospitalisation[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [dateAdmission, setDateAdmission] = useState<string>("")
  const [dateSortie, setDateSortie] = useState<string>("")
  const [editingHospitalisationId, setEditingHospitalisationId] = useState<number | null>(null)

  useEffect(() => {
    fetchPatients()
    fetchServices()
    fetchHospitalisations()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/service/afficherservices")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    }
  }

  const fetchHospitalisations = async () => {
    try {
      const response = await fetch("/api/hospitalisation/afficherhospitalisations")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHospitalisations(data)
    } catch (error) {
      console.error("Failed to fetch hospitalisations:", error)
    }
  }

  const addHospitalisation = async () => {
    try {
      const newHospitalisation = {
        patientId: selectedPatientId,
        serviceId: selectedServiceId,
        dateAdmission: dateAdmission,
        dateSortie: dateSortie || null,
      }

      const response = await fetch("/api/hospitalisation/ajouterhospitalisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHospitalisation),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHospitalisations() // Refresh the list
      clearForm()
    } catch (error) {
      console.error("Failed to add hospitalisation:", error)
    }
  }

  const updateHospitalisation = async (id: number) => {
    try {
      const updatedHospitalisation = {
        patientId: selectedPatientId,
        serviceId: selectedServiceId,
        dateAdmission: dateAdmission,
        dateSortie: dateSortie || null,
      }

      const response = await fetch(`/api/hospitalisation/modifierhospitalisation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedHospitalisation),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHospitalisations() // Refresh the list
      clearForm()
      setEditingHospitalisationId(null)
    } catch (error) {
      console.error("Failed to update hospitalisation:", error)
    }
  }

  const deleteHospitalisation = async (id: number) => {
    try {
      const response = await fetch(`/api/hospitalisation/supprimerhospitalisation/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHospitalisations() // Refresh the list
    } catch (error) {
      console.error("Failed to delete hospitalisation:", error)
    }
  }

  const clearForm = () => {
    setSelectedPatientId(null)
    setSelectedServiceId(null)
    setDateAdmission("")
    setDateSortie("")
  }

  const handleEdit = (hospitalisation: Hospitalisation) => {
    setEditingHospitalisationId(hospitalisation.id)
    setSelectedPatientId(hospitalisation.patientId)
    setSelectedServiceId(hospitalisation.serviceId)
    setDateAdmission(hospitalisation.dateAdmission)
    setDateSortie(hospitalisation.dateSortie || "")
  }

  return (
    <div>
      <h1>Hospitalisations</h1>

      {/* Formulaire d'ajout/modification */}
      <div>
        <h2>{editingHospitalisationId ? "Modifier Hospitalisation" : "Ajouter Hospitalisation"}</h2>
        <select value={selectedPatientId || ""} onChange={(e) => setSelectedPatientId(Number.parseInt(e.target.value))}>
          <option value="">Sélectionner un patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.nom} {patient.prenom}
            </option>
          ))}
        </select>
        <select value={selectedServiceId || ""} onChange={(e) => setSelectedServiceId(Number.parseInt(e.target.value))}>
          <option value="">Sélectionner un service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.nom}
            </option>
          ))}
        </select>
        <input type="date" value={dateAdmission} onChange={(e) => setDateAdmission(e.target.value)} />
        <input type="date" value={dateSortie} onChange={(e) => setDateSortie(e.target.value)} />

        {editingHospitalisationId ? (
          <button onClick={() => updateHospitalisation(editingHospitalisationId)}>Mettre à jour</button>
        ) : (
          <button onClick={addHospitalisation}>Ajouter</button>
        )}
      </div>

      {/* Liste des hospitalisations */}
      <div>
        <h2>Liste des Hospitalisations</h2>
        <ul>
          {hospitalisations.map((hospitalisation) => (
            <li key={hospitalisation.id}>
              Patient ID: {hospitalisation.patientId}, Service ID: {hospitalisation.serviceId}, Date Admission:{" "}
              {hospitalisation.dateAdmission}, Date Sortie: {hospitalisation.dateSortie || "N/A"}
              <button onClick={() => handleEdit(hospitalisation)}>Modifier</button>
              <button onClick={() => deleteHospitalisation(hospitalisation.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HospitalisationsPage
