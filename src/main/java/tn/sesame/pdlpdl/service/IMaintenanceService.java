package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Maintenance;
import tn.sesame.pdlpdl.model.enums.ResultatMaintenance;
import tn.sesame.pdlpdl.model.enums.TypeMaintenance;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface pour le service de gestion des maintenances.
 */
public interface IMaintenanceService extends IService<Maintenance, Long> {
    
    /**
     * Recherche toutes les maintenances d'un équipement spécifique.
     * @param equipementId l'identifiant de l'équipement
     * @return la liste des maintenances de cet équipement
     */
    List<Maintenance> findByEquipementId(Long equipementId);
    
    /**
     * Recherche toutes les maintenances effectuées par un technicien spécifique.
     * @param technicienId l'identifiant du technicien
     * @return la liste des maintenances effectuées par ce technicien
     */
    List<Maintenance> findByTechnicienId(Long technicienId);
    
    /**
     * Recherche toutes les maintenances d'un type spécifique.
     * @param type le type de maintenance
     * @return la liste des maintenances de ce type
     */
    List<Maintenance> findByType(TypeMaintenance type);
    
    /**
     * Recherche toutes les maintenances ayant un résultat spécifique.
     * @param resultat le résultat de la maintenance
     * @return la liste des maintenances ayant ce résultat
     */
    List<Maintenance> findByResultat(ResultatMaintenance resultat);
    
    /**
     * Recherche toutes les maintenances effectuées entre deux dates.
     * @param dateDebut la date de début
     * @param dateFin la date de fin
     * @return la liste des maintenances effectuées entre ces deux dates
     */
    List<Maintenance> findByDateInterventionBetween(LocalDate dateDebut, LocalDate dateFin);
    
    /**
     * Recherche toutes les maintenances en cours.
     * @return la liste des maintenances en cours
     */
    List<Maintenance> findMaintenancesEnCours();
    
    /**
     * Recherche la dernière maintenance réussie d'un équipement.
     * @param equipementId l'identifiant de l'équipement
     * @return la liste des maintenances réussies de cet équipement
     */
    List<Maintenance> findLastSuccessfulMaintenance(Long equipementId);
    
    /**
     * Compte le nombre de maintenances effectuées par un technicien sur une période donnée.
     * @param technicienId l'identifiant du technicien
     * @param dateDebut la date de début
     * @param dateFin la date de fin
     * @return le nombre de maintenances effectuées
     */
    Long countMaintenancesByTechnicienAndPeriod(Long technicienId, LocalDate dateDebut, LocalDate dateFin);
    
    /**
     * Calcule le coût total des maintenances sur une période donnée.
     * @param dateDebut la date de début
     * @param dateFin la date de fin
     * @return le coût total des maintenances
     */
    Double getTotalCostByPeriod(LocalDate dateDebut, LocalDate dateFin);
}