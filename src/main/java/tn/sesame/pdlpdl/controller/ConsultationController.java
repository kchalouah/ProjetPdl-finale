package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.service.IConsultationService;
import tn.sesame.pdlpdl.service.IDossierMedicalService;
import tn.sesame.pdlpdl.service.IMedecinService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des consultations médicales.
 */
@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final IConsultationService consultationService;
    private final IDossierMedicalService dossierMedicalService;
    private final IMedecinService medecinService;

    @Autowired
    public ConsultationController(IConsultationService consultationService,
                                  IDossierMedicalService dossierMedicalService,
                                  IMedecinService medecinService) {
        this.consultationService = consultationService;
        this.dossierMedicalService = dossierMedicalService;
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

    @GetMapping("/dossier/{dossierMedicalId}")
    public ResponseEntity<List<Consultation>> getConsultationsByDossierMedical(@PathVariable Long dossierMedicalId) {
        return dossierMedicalService.findById(dossierMedicalId)
                .map(dossierMedical -> ResponseEntity.ok(consultationService.findByDossierMedical(dossierMedical)))
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

    @GetMapping("/medecin/{medecinId}/dossier/{dossierMedicalId}")
    public ResponseEntity<List<Consultation>> getConsultationsByMedecinAndDossierMedical(
            @PathVariable Long medecinId, @PathVariable Long dossierMedicalId) {
        Optional<Medecin> medecinOpt = medecinService.findById(medecinId);
        Optional<DossierMedical> dossierMedicalOpt = dossierMedicalService.findById(dossierMedicalId);

        if (medecinOpt.isPresent() && dossierMedicalOpt.isPresent()) {
            return ResponseEntity.ok(consultationService.findByMedecinAndDossierMedical(
                    medecinOpt.get(), dossierMedicalOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/creer")
    public ResponseEntity<Consultation> createConsultation(
            @RequestBody Consultation consultation,
            @RequestParam Long medecinId,
            @RequestParam Long dossierMedicalId) {
        Optional<Medecin> medecinOpt = medecinService.findById(medecinId);
        Optional<DossierMedical> dossierMedicalOpt = dossierMedicalService.findById(dossierMedicalId);

        if (medecinOpt.isPresent() && dossierMedicalOpt.isPresent()) {
            consultation.setMedecin(medecinOpt.get());
            consultation.setDossierMedical(dossierMedicalOpt.get());
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
            @RequestParam(required = false) Long dossierMedicalId) {

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
            if (medecinOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            consultation.setMedecin(medecinOpt.get());
        } else {
            consultation.setMedecin(existing.getMedecin());
        }

        if (dossierMedicalId != null) {
            Optional<DossierMedical> dossierOpt = dossierMedicalService.findById(dossierMedicalId);
            if (dossierOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            consultation.setDossierMedical(dossierOpt.get());
        } else {
            consultation.setDossierMedical(existing.getDossierMedical());
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
}
