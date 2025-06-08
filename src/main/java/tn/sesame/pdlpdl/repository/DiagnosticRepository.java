package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Diagnostic;

import java.util.Date;
import java.util.List;

/**
 * Repository pour la gestion des diagnostics médicaux.
 */
@Repository
public interface DiagnosticRepository extends JpaRepository<Diagnostic, Long> {
    
    /**
     * Recherche tous les diagnostics liés à une consultation spécifique.
     * @param consultation la consultation recherchée
     * @return la liste des diagnostics liés à cette consultation
     */
    List<Diagnostic> findByConsultation(Consultation consultation);
    
    /**
     * Recherche tous les diagnostics effectués après une date spécifique.
     * @param date la date minimale
     * @return la liste des diagnostics effectués après cette date
     */
    List<Diagnostic> findByDateHeureAfter(Date date);
    
    /**
     * Recherche tous les diagnostics contenant une description spécifique.
     * @param keyword le mot-clé recherché dans la description
     * @return la liste des diagnostics correspondants
     */
    List<Diagnostic> findByDescriptionContaining(String keyword);
}