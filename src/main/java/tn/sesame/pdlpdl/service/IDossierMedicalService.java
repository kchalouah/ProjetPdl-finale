package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des dossiers médicaux.
 */
public interface IDossierMedicalService extends IService<DossierMedical, Long> {
    
    /**
     * Recherche un dossier médical par son patient.
     * @param patient le patient associé au dossier
     * @return un Optional contenant le dossier médical s'il existe
     */
    Optional<DossierMedical> findByPatient(Patient patient);
    
    /**
     * Recherche tous les dossiers médicaux créés après une date spécifique.
     * @param date la date de création minimale
     * @return la liste des dossiers médicaux créés après cette date
     */
    List<DossierMedical> findByDateCreationAfter(Date date);
    
    /**
     * Recherche tous les dossiers médicaux contenant des antécédents médicaux spécifiques.
     * @param keyword le mot-clé recherché dans les antécédents
     * @return la liste des dossiers médicaux correspondants
     */
    List<DossierMedical> findByAntecedentsMedicauxContaining(String keyword);
}