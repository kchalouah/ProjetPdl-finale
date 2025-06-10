package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Patient;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.service.IConsultationService;
import tn.sesame.pdlpdl.service.IPatientService;
import tn.sesame.pdlpdl.service.IMedecinService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final IConsultationService consultationService;
    private final IPatientService patientService;
    private final IMedecinService medecinService;

    @Autowired
    public ConsultationController(IConsultationService consultationService, IPatientService patientService, IMedecinService medecinService) {
        this.consultationService = consultationService;
        this.patientService = patientService;
        this.medecinService = medecinService;
    }

    @GetMapping("/lister")
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.findAll());
    }

    @GetMapping("/voir/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        return consultationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getConsultationsByPatient(@PathVariable Long patientId) {
        return patientService.findById(patientId)
                .map(patient -> ResponseEntity.ok(consultationService.findByPatient(patient)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<Consultation>> getConsultationsByMedecin(@PathVariable Long medecinId) {
        return medecinService.findById(medecinId)
                .map(medecin -> ResponseEntity.ok(consultationService.findByMedecin(medecin)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/apres")
    public ResponseEntity<List<Consultation>> getConsultationsAfterDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {
        return ResponseEntity.ok(consultationService.findByDateHeureAfter(date));
    }

    @GetMapping("/periode")
    public ResponseEntity<List<Consultation>> getConsultationsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fin) {
        return ResponseEntity.ok(consultationService.findByDateHeureBetween(debut, fin));
    }

    @GetMapping("/medecin/{medecinId}/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getConsultationsByMedecinAndPatient(
            @PathVariable Long medecinId, @PathVariable Long patientId) {
        Optional<Medecin> medecinOpt = medecinService.findById(medecinId);
        Optional<Patient> patientOpt = patientService.findById(patientId);

        if (medecinOpt.isPresent() && patientOpt.isPresent()) {
            return ResponseEntity.ok(consultationService.findByMedecinAndPatient(
                    medecinOpt.get(), patientOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/creer")
    public ResponseEntity<Consultation> createConsultation(
            @RequestBody Consultation consultation,
            @RequestParam Long medecinId,
            @RequestParam Long patientId) {

        Optional<Medecin> medecinOpt = medecinService.findById(medecinId);
        Optional<Patient> patientOpt = patientService.findById(patientId);

        var x = medecinOpt.isPresent();
        var y = patientOpt.isPresent();
        if (medecinOpt.isPresent() && patientOpt.isPresent()) {
            consultation.setMedecin(medecinOpt.get());
            consultation.setPatient(patientOpt.get());
            Consultation saved = consultationService.save(consultation);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Consultation> updateConsultation(
            @PathVariable Long id,
            @RequestBody Consultation consultation,
            @RequestParam(required = false) Long medecinId,
            @RequestParam(required = false) Long patientId) {

        if (!consultationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        consultation.setId(id);
        Optional<Consultation> existingOpt = consultationService.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Consultation existing = existingOpt.get();

        if (medecinId != null) {
            Optional<Medecin> medecinOpt = medecinService.findById(medecinId);
            if (medecinOpt.isEmpty()) return ResponseEntity.notFound().build();
            consultation.setMedecin(medecinOpt.get());
        } else {
            consultation.setMedecin(existing.getMedecin());
        }

        if (patientId != null) {
            Optional<Patient> patientOpt = patientService.findById(patientId);
            if (patientOpt.isEmpty()) return ResponseEntity.notFound().build();
            consultation.setPatient(patientOpt.get());
        } else {
            consultation.setPatient(existing.getPatient());
        }

        return ResponseEntity.ok(consultationService.save(consultation));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        if (!consultationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        consultationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/email")
    public ResponseEntity<List<Consultation>> getConsultationsByPatientEmail(@RequestParam String email) {
        Optional<Patient> patientOpt = patientService.findByEmail(email);
        if (patientOpt.isPresent()) {
            return ResponseEntity.ok(consultationService.findByPatient(patientOpt.get()));
        } else {
            return ResponseEntity.ok(List.of());
        }
    }
}