package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Planning;
import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.model.enums.JourEnum;

import java.time.LocalTime;
import java.util.List;

/**
 * Repository pour la gestion des plannings du personnel soignant.
 */
@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {
    
    /**
     * Recherche tous les plannings d'un utilisateur spécifique.
     * @param utilisateur l'utilisateur recherché
     * @return la liste des plannings de cet utilisateur
     */
    List<Planning> findByUtilisateur(Utilisateur utilisateur);
    
    /**
     * Recherche tous les plannings pour un jour spécifique.
     * @param jour le jour recherché
     * @return la liste des plannings pour ce jour
     */
    List<Planning> findByJour(JourEnum jour);
    
    /**
     * Recherche tous les plannings d'un utilisateur pour un jour spécifique.
     * @param utilisateur l'utilisateur recherché
     * @param jour le jour recherché
     * @return la liste des plannings correspondants
     */
    List<Planning> findByUtilisateurAndJour(Utilisateur utilisateur, JourEnum jour);
    
    /**
     * Recherche tous les plannings commençant après une heure spécifique.
     * @param heure l'heure minimale de début
     * @return la liste des plannings commençant après cette heure
     */
    List<Planning> findByHeureDebutAfter(LocalTime heure);
    
    /**
     * Recherche tous les plannings se terminant avant une heure spécifique.
     * @param heure l'heure maximale de fin
     * @return la liste des plannings se terminant avant cette heure
     */
    List<Planning> findByHeureFinBefore(LocalTime heure);
    
    /**
     * Recherche tous les plannings pour un jour spécifique et commençant après une heure spécifique.
     * @param jour le jour recherché
     * @param heure l'heure minimale de début
     * @return la liste des plannings correspondants
     */
    List<Planning> findByJourAndHeureDebutAfter(JourEnum jour, LocalTime heure);
}