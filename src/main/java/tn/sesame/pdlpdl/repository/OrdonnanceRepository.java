package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Ordonnance;

import java.util.Date;
import java.util.List;

/**
 * Repository pour la gestion des ordonnances médicales.
 */
@Repository
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {
    
    /**
     * Recherche toutes les ordonnances liées à une consultation spécifique.
     * @param consultation la consultation recherchée
     * @return la liste des ordonnances liées à cette consultation
     */
    List<Ordonnance> findByConsultation(Consultation consultation);
    
    /**
     * Recherche toutes les ordonnances émises après une date spécifique.
     * @param date la date minimale
     * @return la liste des ordonnances émises après cette date
     */
    List<Ordonnance> findByDateHeureAfter(Date date);
    
    /**
     * Recherche toutes les ordonnances contenant des prescriptions spécifiques.
     * @param keyword le mot-clé recherché dans les prescriptions
     * @return la liste des ordonnances correspondantes
     */
    List<Ordonnance> findByPrescriptionsContaining(String keyword);
    
    /**
     * Recherche toutes les ordonnances ayant une durée de traitement supérieure à une valeur.
     * @param duree la durée minimale du traitement
     * @return la liste des ordonnances correspondantes
     */
    List<Ordonnance> findByDureeTraitementGreaterThan(Integer duree);
}