package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Ordonnance;
import tn.sesame.pdlpdl.service.IOrdonnanceService;
import tn.sesame.pdlpdl.service.IConsultationService;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordonnances")
public class OrdonnanceController {

    private final IOrdonnanceService ordonnanceService;
    private final IConsultationService consultationService;

    @Autowired
    public OrdonnanceController(IOrdonnanceService ordonnanceService, IConsultationService consultationService) {
        this.consultationService = consultationService;
        this.ordonnanceService = ordonnanceService;
    }

    @Autowired
    private tn.sesame.pdlpdl.service.IPatientService patientService;

    @GetMapping("/afficherordonnances")
    public ResponseEntity<List<Ordonnance>> getAll() {
        return ResponseEntity.ok(ordonnanceService.findAll());
    }

    @GetMapping("/afficherordonnance/{id}")
    public ResponseEntity<Ordonnance> getById(@PathVariable Long id) {
        return ordonnanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterordonnance")
    public ResponseEntity<Ordonnance> create(@RequestBody Map<String, Object> body, @RequestParam Long consultationId) {
        Consultation consultation = consultationService.findById(consultationId).orElse(null);
        if (consultation == null) return ResponseEntity.badRequest().build();

        Ordonnance entity = new Ordonnance();
        entity.setConsultation(consultation);
        entity.setMedicaments((String) body.get("medicaments"));
        entity.setInstructions((String) body.get("instructions"));
        entity.setPrescriptions((String) body.get("prescriptions")); // Set prescriptions
        entity.setDatePrescription(new Date());
        entity.setDateHeure(new Date());
        return ResponseEntity.ok(ordonnanceService.save(entity));
    }

    @PutMapping("/modifierordonnance/{id}")
    public ResponseEntity<Ordonnance> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!ordonnanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Ordonnance entity = ordonnanceService.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        if (body.containsKey("medicaments")) {
            entity.setMedicaments((String) body.get("medicaments"));
        }
        if (body.containsKey("instructions")) {
            entity.setInstructions((String) body.get("instructions"));
        }
        if (body.containsKey("prescriptions")) {
            entity.setPrescriptions((String) body.get("prescriptions"));
        }
        // Optionally update consultation if needed
        if (body.containsKey("consultation_id")) {
            Long consultationId = Long.valueOf(body.get("consultation_id").toString());
            Consultation consultation = consultationService.findById(consultationId).orElse(null);
            if (consultation != null) {
                entity.setConsultation(consultation);
            }
        }
        return ResponseEntity.ok(ordonnanceService.save(entity));
    }

    @DeleteMapping("/supprimerordonnance/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!ordonnanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordonnanceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Ordonnance>> getOrdonnancesByPatientEmail(@RequestParam String email) {
        Optional<Patient> patientOpt = patientService.findByEmail(email);
        if (patientOpt.isEmpty()) return ResponseEntity.ok(List.of());
        List<Consultation> consultations = consultationService.findByPatient(patientOpt.get());
        List<Ordonnance> ordonnances = ordonnanceService.findByConsultations(consultations);
        return ResponseEntity.ok(ordonnances);
    }
}