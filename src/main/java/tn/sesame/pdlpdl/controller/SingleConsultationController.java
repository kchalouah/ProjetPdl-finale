package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.service.IConsultationService;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des consultations médicales (endpoints singuliers).
 * Ce contrôleur est utilisé pour les endpoints qui utilisent le chemin singulier "/api/consultation".
 */
@RestController
@RequestMapping("/api/consultation")
public class SingleConsultationController {

    private final IConsultationService consultationService;

    @Autowired
    public SingleConsultationController(IConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @GetMapping("/afficherconsultation")
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.findAll());
    }
}