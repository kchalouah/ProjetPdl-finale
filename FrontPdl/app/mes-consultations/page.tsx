"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Consultation {
  id: number
  date: string
  time: string
  doctor: string
  patient: string
  notes: string
}

const MesConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [newConsultation, setNewConsultation] = useState<Omit<Consultation, "id">>({
    date: "",
    time: "",
    doctor: "",
    patient: "",
    notes: "",
  })
  const [editingConsultationId, setEditingConsultationId] = useState<number | null>(null)
  const [editedConsultation, setEditedConsultation] = useState<Consultation | null>(null)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/consultations/lister")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setConsultations(data)
    } catch (error) {
      console.error("Could not fetch consultations:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewConsultation((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editedConsultation) {
      setEditedConsultation((prev) => ({ ...prev, [name]: value }))
    }
  }

  const createConsultation = async () => {
    try {
      const response = await fetch("/api/consultations/creer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConsultation),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchConsultations() // Refresh the list
      setNewConsultation({ date: "", time: "", doctor: "", patient: "", notes: "" }) // Clear the form
    } catch (error) {
      console.error("Could not create consultation:", error)
    }
  }

  const startEditing = (consultation: Consultation) => {
    setEditingConsultationId(consultation.id)
    setEditedConsultation(consultation)
  }

  const updateConsultation = async () => {
    if (!editedConsultation) return

    try {
      const response = await fetch(`/api/consultations/modifier/${editedConsultation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedConsultation),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchConsultations() // Refresh the list
      setEditingConsultationId(null)
      setEditedConsultation(null)
    } catch (error) {
      console.error("Could not update consultation:", error)
    }
  }

  const deleteConsultation = async (id: number) => {
    try {
      const response = await fetch(`/api/consultations/supprimer/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchConsultations() // Refresh the list
    } catch (error) {
      console.error("Could not delete consultation:", error)
    }
  }

  return (
    <div>
      <h1>Mes Consultations</h1>

      {/* Display Consultations */}
      <ul>
        {consultations.map((consultation) => (
          <li key={consultation.id}>
            {editingConsultationId === consultation.id ? (
              <div>
                <input
                  type="date"
                  name="date"
                  value={editedConsultation?.date || ""}
                  onChange={handleEditInputChange}
                />
                <input
                  type="time"
                  name="time"
                  value={editedConsultation?.time || ""}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="doctor"
                  value={editedConsultation?.doctor || ""}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="patient"
                  value={editedConsultation?.patient || ""}
                  onChange={handleEditInputChange}
                />
                <textarea name="notes" value={editedConsultation?.notes || ""} onChange={handleEditInputChange} />
                <button onClick={updateConsultation}>Update</button>
                <button onClick={() => setEditingConsultationId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {consultation.date} - {consultation.time} - {consultation.doctor} - {consultation.patient} -{" "}
                {consultation.notes}
                <button onClick={() => startEditing(consultation)}>Edit</button>
                <button onClick={() => deleteConsultation(consultation.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Create Consultation Form */}
      <h2>Create New Consultation</h2>
      <input type="date" name="date" value={newConsultation.date} onChange={handleInputChange} />
      <input type="time" name="time" value={newConsultation.time} onChange={handleInputChange} />
      <input type="text" name="doctor" value={newConsultation.doctor} onChange={handleInputChange} />
      <input type="text" name="patient" value={newConsultation.patient} onChange={handleInputChange} />
      <textarea name="notes" value={newConsultation.notes} onChange={handleInputChange} />
      <button onClick={createConsultation}>Create</button>
    </div>
  )
}

export default MesConsultations
