"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridValueGetterParams } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

interface Diagnostic {
  id: number
  date: string
  description: string
  consultationId: number
}

interface Consultation {
  id: number
  date: string
  patientId: number
  doctorId: number
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "date", headerName: "Date", width: 130 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "consultationId", headerName: "Consultation ID", width: 130 },
]

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Diagnostic, "id">>({
    date: "",
    description: "",
    consultationId: 0,
  })
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    fetchDiagnostics()
    fetchConsultations()
  }, [])

  const fetchDiagnostics = async () => {
    const response = await fetch("/api/diagnostic/afficherdiagnostics")
    const data = await response.json()
    setDiagnostics(data)
  }

  const fetchConsultations = async () => {
    const response = await fetch("/api/consultations/lister")
    const data = await response.json()
    setConsultations(data)
  }

  const handleClickOpen = () => {
    setOpen(true)
    setIsEdit(false)
    setFormData({ date: "", description: "", consultationId: 0 })
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedDiagnostic(null)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleConsultationChange = (event: any) => {
    setFormData({ ...formData, consultationId: Number.parseInt(event.target.value) })
  }

  const handleSubmit = async () => {
    if (isEdit && selectedDiagnostic) {
      await updateDiagnostic(selectedDiagnostic.id)
    } else {
      await createDiagnostic()
    }
  }

  const createDiagnostic = async () => {
    const response = await fetch("/api/diagnostic/ajouterdiagnostic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      fetchDiagnostics()
      handleClose()
    } else {
      console.error("Failed to create diagnostic")
    }
  }

  const updateDiagnostic = async (id: number) => {
    const response = await fetch(`/api/diagnostic/modifierdiagnostic/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      fetchDiagnostics()
      handleClose()
    } else {
      console.error("Failed to update diagnostic")
    }
  }

  const deleteDiagnostic = async (id: number) => {
    const response = await fetch(`/api/diagnostic/supprimerdiagnostic/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      fetchDiagnostics()
    } else {
      console.error("Failed to delete diagnostic")
    }
  }

  const handleEdit = (params: GridValueGetterParams) => {
    const diagnostic = params.row as Diagnostic
    setSelectedDiagnostic(diagnostic)
    setFormData({
      date: diagnostic.date,
      description: diagnostic.description,
      consultationId: diagnostic.consultationId,
    })
    setIsEdit(true)
    setOpen(true)
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Diagnostic
      </Button>
      <DataGrid rows={diagnostics} columns={columns} getRowId={(row) => row.id} onRowDoubleClick={handleEdit} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Diagnostic" : "Create Diagnostic"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="consultation-select-label">Consultation</InputLabel>
            <Select
              labelId="consultation-select-label"
              id="consultationId"
              name="consultationId"
              value={formData.consultationId}
              label="Consultation"
              onChange={handleConsultationChange}
            >
              {consultations.map((consultation) => (
                <MenuItem key={consultation.id} value={consultation.id}>
                  {consultation.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
          {isEdit && (
            <Button
              onClick={() => {
                if (selectedDiagnostic) {
                  deleteDiagnostic(selectedDiagnostic.id)
                  handleClose()
                }
              }}
              color="error"
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
