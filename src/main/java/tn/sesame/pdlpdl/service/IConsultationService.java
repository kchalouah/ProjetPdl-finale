package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.model.entities.Medecin;

import java.util.Date;
import java.util.List;

/**
 * Interface pour le service de gestion des consultations médicales.
 */
public interface IConsultationService extends IService<Consultation, Long> {
    
    /**
     * Recherche toutes les consultations liées à un dossier médical spécifique.
     * @param dossierMedical le dossier médical recherché
     * @return la liste des consultations liées à ce dossier
     */
    List<Consultation> findByDossierMedical(DossierMedical dossierMedical);
    
    /**
     * Recherche toutes les consultations effectuées par un médecin spécifique.
     * @param medecin le médecin recherché
     * @return la liste des consultations effectuées par ce médecin
     */
    List<Consultation> findByMedecin(Medecin medecin);
    
    /**
     * Recherche toutes les consultations effectuées après une date spécifique.
     * @param date la date minimale
     * @return la liste des consultations effectuées après cette date
     */
    List<Consultation> findByDateHeureAfter(Date date);
    
    /**
     * Recherche toutes les consultations effectuées entre deux dates.
     * @param debut la date de début
     * @param fin la date de fin
     * @return la liste des consultations effectuées entre ces deux dates
     */
    List<Consultation> findByDateHeureBetween(Date debut, Date fin);
    
    /**
     * Recherche toutes les consultations effectuées par un médecin pour un dossier médical spécifique.
     * @param medecin le médecin recherché
     * @param dossierMedical le dossier médical recherché
     * @return la liste des consultations correspondantes
     */
    List<Consultation> findByMedecinAndDossierMedical(Medecin medecin, DossierMedical dossierMedical);
}