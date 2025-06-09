package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Diagnostic;
import tn.sesame.pdlpdl.model.entities.Consultation;
import java.util.List;

public interface IDiagnosticService extends IService<Diagnostic, Long> {
    // Méthodes spécifiques à Diagnostic à ajouter ici
    List<Diagnostic> findByConsultations(List<Consultation> consultations);
}
