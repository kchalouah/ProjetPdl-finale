package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.*;
import tn.sesame.pdlpdl.model.enums.EtatEquipement;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {

    // Recherche par numéro de série
    Optional<Equipement> findByNumeroSerie(String numeroSerie);

    // Recherche par état
    List<Equipement> findByEtat(EtatEquipement etat);

    // Recherche par type
    List<Equipement> findByTypeContainingIgnoreCase(String type);

    // Recherche par localisation    List<Equipement> findByLocalisationContainingIgnoreCase(String localisation);

    // Équipements nécessitant une maintenance
    @Query("SELECT e FROM Equipement e WHERE e.dateProchaineMaintenance <= :date")
    List<Equipement> findEquipementsNecessitantMaintenance(@Param("date") LocalDate date);

    // Équipements en alerte (maintenance urgente)
    @Query("SELECT e FROM Equipement e WHERE e.dateProchaineMaintenance <= :date OR e.etat = 'HORS_SERVICE'")
    List<Equipement> findEquipementsEnAlerte(@Param("date") LocalDate date);

    // Recherche globale
    @Query("SELECT e FROM Equipement e WHERE " +
            "LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.modele) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.localisation) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Equipement> searchEquipements(@Param("search") String search);

    // Statistiques
    @Query("SELECT COUNT(e) FROM Equipement e WHERE e.etat = :etat")
    Long countByEtat(@Param("etat") EtatEquipement etat);
}