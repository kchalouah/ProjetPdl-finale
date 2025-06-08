package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Service;

import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des blocs hospitaliers.
 */
public interface IBlocService extends IService<Bloc, Long> {
    
    /**
     * Recherche un bloc par son numéro.
     * @param numero le numéro du bloc
     * @return un Optional contenant le bloc s'il existe
     */
    Optional<Bloc> findByNumero(String numero);
    
    /**
     * Recherche tous les blocs appartenant à un service spécifique.
     * @param service le service recherché
     * @return la liste des blocs appartenant à ce service
     */
    List<Bloc> findByService(Service service);
    
    /**
     * Vérifie si un bloc existe par son numéro.
     * @param numero le numéro du bloc
     * @return true si le bloc existe, false sinon
     */
    boolean existsByNumero(String numero);
    
    /**
     * Vérifie si un bloc existe par son numéro et son service.
     * @param numero le numéro du bloc
     * @param service le service du bloc
     * @return true si le bloc existe, false sinon
     */
    boolean existsByNumeroAndService(String numero, Service service);
}