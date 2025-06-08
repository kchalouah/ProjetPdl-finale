package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Equipement;
import tn.sesame.pdlpdl.model.enums.EtatEquipement;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des équipements.
 */
public interface IEquipementService extends IService<Equipement, Long> {
    
    /**
     * Recherche un équipement par son numéro de série.
     * @param numeroSerie le numéro de série de l'équipement
     * @return un Optional contenant l'équipement s'il existe
     */
    Optional<Equipement> findByNumeroSerie(String numeroSerie);
    
    /**
     * Recherche tous les équipements ayant un état spécifique.
     * @param etat l'état recherché
     * @return la liste des équipements ayant cet état
     */
    List<Equipement> findByEtat(EtatEquipement etat);
    
    /**
     * Recherche tous les équipements d'un type spécifique.
     * @param type le type recherché
     * @return la liste des équipements de ce type
     */
    List<Equipement> findByType(String type);
    
    /**
     * Recherche tous les équipements dans une localisation spécifique.
     * @param localisation la localisation recherchée
     * @return la liste des équipements dans cette localisation
     */
    List<Equipement> findByLocalisation(String localisation);
    
    /**
     * Recherche tous les équipements nécessitant une maintenance.
     * @param date la date de référence
     * @return la liste des équipements nécessitant une maintenance
     */
    List<Equipement> findEquipementsNecessitantMaintenance(LocalDate date);
    
    /**
     * Recherche tous les équipements en alerte.
     * @param date la date de référence
     * @return la liste des équipements en alerte
     */
    List<Equipement> findEquipementsEnAlerte(LocalDate date);
    
    /**
     * Recherche des équipements selon un terme de recherche.
     * @param search le terme de recherche
     * @return la liste des équipements correspondant au terme de recherche
     */
    List<Equipement> searchEquipements(String search);
    
    /**
     * Compte le nombre d'équipements ayant un état spécifique.
     * @param etat l'état recherché
     * @return le nombre d'équipements ayant cet état
     */
    Long countByEtat(EtatEquipement etat);
}