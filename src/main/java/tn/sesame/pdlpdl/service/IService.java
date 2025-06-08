package tn.sesame.pdlpdl.service;

import java.util.List;
import java.util.Optional;

/**
 * Interface générique pour les services.
 * @param <T> le type d'entité
 * @param <ID> le type de l'identifiant de l'entité
 */
public interface IService<T, ID> {
    
    /**
     * Sauvegarde une entité.
     * @param entity l'entité à sauvegarder
     * @return l'entité sauvegardée
     */
    T save(T entity);
    
    /**
     * Récupère toutes les entités.
     * @return la liste de toutes les entités
     */
    List<T> findAll();
    
    /**
     * Récupère une entité par son identifiant.
     * @param id l'identifiant de l'entité
     * @return un Optional contenant l'entité si elle existe
     */
    Optional<T> findById(ID id);
    
    /**
     * Supprime une entité par son identifiant.
     * @param id l'identifiant de l'entité à supprimer
     */
    void deleteById(ID id);
    
    /**
     * Vérifie si une entité existe par son identifiant.
     * @param id l'identifiant de l'entité
     * @return true si l'entité existe, false sinon
     */
    boolean existsById(ID id);
}