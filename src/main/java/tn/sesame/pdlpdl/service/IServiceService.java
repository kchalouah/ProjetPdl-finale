package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Service;

import java.util.Optional;

/**
 * Interface pour le service de gestion des services hospitaliers.
 */
public interface IServiceService extends IService<Service, Long> {
    
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