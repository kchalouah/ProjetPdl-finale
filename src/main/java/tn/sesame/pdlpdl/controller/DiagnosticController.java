package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Diagnostic;
import tn.sesame.pdlpdl.service.IDiagnosticService;
import tn.sesame.pdlpdl.service.IConsultationService;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    private final IDiagnosticService diagnosticService;
    private final IConsultationService consultationService;

    @Autowired
    public DiagnosticController(IDiagnosticService diagnosticService, IConsultationService consultationService) {
        this.consultationService = consultationService;
        this.diagnosticService = diagnosticService;
    }

    @Autowired
    private tn.sesame.pdlpdl.service.IPatientService patientService;

    @GetMapping("/afficherdiagnostics")
    public ResponseEntity<List<Diagnostic>> getAll() {
        return ResponseEntity.ok(diagnosticService.findAll());
    }

    @GetMapping("/afficherdiagnostic/{id}")
    public ResponseEntity<Diagnostic> getById(@PathVariable Long id) {
        return diagnosticService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterdiagnostic")
    public ResponseEntity<Diagnostic> create(@RequestBody Map<String, Object> body, @RequestParam Long consultationId) {
        Consultation consultation = consultationService.findById(consultationId).orElse(null);
        if (consultation == null) {
            return ResponseEntity.badRequest().build();
        }
        String description = (String) body.get("description");
        if (description == null || description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        Diagnostic entity = new Diagnostic();
        entity.setDescription(description);
        entity.setRecommandations(null);
        Object dateObj = body.get("date");
        if (dateObj != null) {
            try {
                entity.setDateHeure(java.sql.Date.valueOf((String) dateObj));
            } catch (Exception e) {
                entity.setDateHeure(new Date());
            }
        } else {
            entity.setDateHeure(new Date());
        }
        entity.setConsultation(consultation);
        return ResponseEntity.ok(diagnosticService.save(entity));
    }

    @PutMapping("/modifierdiagnostic/{id}")
    public ResponseEntity<Diagnostic> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!diagnosticService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Diagnostic entity = diagnosticService.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        String description = (String) body.get("description");
        if (description != null) {
            entity.setDescription(description);
        }
        Object dateObj = body.get("date");
        if (dateObj != null) {
            try {
                entity.setDateHeure(java.sql.Date.valueOf((String) dateObj));
            } catch (Exception e) {
                // ignore invalid date
            }
        }
        if (body.containsKey("recommandations")) {
            entity.setRecommandations((String) body.get("recommandations"));
        }
        return ResponseEntity.ok(diagnosticService.save(entity));
    }

    @DeleteMapping("/supprimerdiagnostic/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!diagnosticService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        diagnosticService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Diagnostic>> getDiagnosticsByPatientEmail(@RequestParam String email) {
        Optional<Patient> patientOpt = patientService.findByEmail(email);
        if (patientOpt.isEmpty()) return ResponseEntity.ok(List.of());
        List<Consultation> consultations = consultationService.findByPatient(patientOpt.get());
        List<Diagnostic> diagnostics = diagnosticService.findByConsultations(consultations);
        return ResponseEntity.ok(diagnostics);
    }
}