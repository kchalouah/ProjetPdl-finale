"use client"

import { useState, useEffect } from "react"

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

const OrdonnancesPage = () => {
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null)
  const [medicaments, setMedicaments] = useState("")
  const [instructions, setInstructions] = useState("")
  const [editingOrdonnanceId, setEditingOrdonnanceId] = useState<number | null>(null)

  useEffect(() => {
    fetchOrdonnances()
    fetchConsultations()
  }, [])

  const fetchOrdonnances = async () => {
    try {
      const response = await fetch("/api/ordonnances/afficherordonnances")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setOrdonnances(data)
    } catch (error) {
      console.error("Failed to fetch ordonnances:", error)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/consultations/lister")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConsultations(data)
    } catch (error) {
      console.error("Failed to fetch consultations:", error)
    }
  }

  const handleAddOrdonnance = async () => {
    if (!selectedConsultationId || !medicaments || !instructions) {
      alert("Please fill all fields.")
      return
    }

    try {
      const response = await fetch("/api/ordonnances/ajouterordonnance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultation_id: selectedConsultationId,
          medicaments,
          instructions,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchOrdonnances() // Refresh the ordonnance list
      setMedicaments("")
      setInstructions("")
      setSelectedConsultationId(null)
    } catch (error) {
      console.error("Failed to add ordonnance:", error)
    }
  }

  const handleUpdateOrdonnance = async (id: number) => {
    if (!medicaments || !instructions) {
      alert("Please fill all fields.")
      return
    }

    try {
      const response = await fetch(`/api/ordonnances/modifierordonnance/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicaments,
          instructions,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchOrdonnances() // Refresh the ordonnance list
      setMedicaments("")
      setInstructions("")
      setEditingOrdonnanceId(null)
    } catch (error) {
      console.error("Failed to update ordonnance:", error)
    }
  }

  const handleDeleteOrdonnance = async (id: number) => {
    try {
      const response = await fetch(`/api/ordonnances/supprimerordonnance/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchOrdonnances() // Refresh the ordonnance list
    } catch (error) {
      console.error("Failed to delete ordonnance:", error)
    }
  }

  return (
    <div>
      <h1>Ordonnances</h1>

      <div>
        <h2>Add Ordonnance</h2>
        <select
          value={selectedConsultationId || ""}
          onChange={(e) => setSelectedConsultationId(Number.parseInt(e.target.value))}
        >
          <option value="">Select Consultation</option>
          {consultations.map((consultation) => (
            <option key={consultation.id} value={consultation.id}>
              Consultation ID: {consultation.id} - Date: {consultation.date_consultation}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Medicaments"
          value={medicaments}
          onChange={(e) => setMedicaments(e.target.value)}
        />
        <input
          type="text"
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button onClick={handleAddOrdonnance}>Add Ordonnance</button>
      </div>

      <div>
        <h2>Ordonnances List</h2>
        {ordonnances.map((ordonnance) => (
          <div key={ordonnance.id}>
            {editingOrdonnanceId === ordonnance.id ? (
              <>
                <input
                  type="text"
                  placeholder="Medicaments"
                  value={medicaments}
                  onChange={(e) => setMedicaments(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
                <button onClick={() => handleUpdateOrdonnance(ordonnance.id)}>Update</button>
                <button onClick={() => setEditingOrdonnanceId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>Ordonnance ID: {ordonnance.id}</p>
                <p>Consultation ID: {ordonnance.consultation_id}</p>
                <p>Medicaments: {ordonnance.medicaments}</p>
                <p>Instructions: {ordonnance.instructions}</p>
                <p>Date: {ordonnance.date_prescription}</p>
                <button
                  onClick={() => {
                    setEditingOrdonnanceId(ordonnance.id)
                    setMedicaments(ordonnance.medicaments)
                    setInstructions(ordonnance.instructions)
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteOrdonnance(ordonnance.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdonnancesPage
