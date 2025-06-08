package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Service;

import java.util.Optional;

/**
 * Repository pour la gestion des services hospitaliers.
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    /**
     * Recherche un service par son nom.
     * @param nom le nom du service
     * @return un Optional contenant le service s'il existe
     */
    Optional<Service> findByNom(String nom);
    
    /**
     * Vérifie si un service existe par son nom.
     * @param nom le nom du service
     * @return true si le service existe, false sinon
     */
    boolean existsByNom(String nom);
}