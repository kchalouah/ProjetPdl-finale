package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Ordonnance;
import tn.sesame.pdlpdl.model.entities.Consultation;
import java.util.List;

public interface IOrdonnanceService extends IService<Ordonnance, Long> {
    // Méthodes spécifiques à Ordonnance à ajouter ici
    List<Ordonnance> findByConsultations(List<Consultation> consultations);
}
