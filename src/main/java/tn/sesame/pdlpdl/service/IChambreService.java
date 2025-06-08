package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Chambre;

import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des chambres hospitalières.
 */
public interface IChambreService extends IService<Chambre, Long> {
    
    /**
     * Recherche une chambre par son numéro.
     * @param numero le numéro de la chambre
     * @return un Optional contenant la chambre si elle existe
     */
    Optional<Chambre> findByNumero(String numero);
    
    /**
     * Recherche toutes les chambres appartenant à un bloc spécifique.
     * @param bloc le bloc recherché
     * @return la liste des chambres appartenant à ce bloc
     */
    List<Chambre> findByBloc(Bloc bloc);
    
    /**
     * Recherche toutes les chambres ayant une capacité supérieure ou égale à une valeur.
     * @param capacite la capacité minimale
     * @return la liste des chambres ayant cette capacité minimale
     */
    List<Chambre> findByCapaciteGreaterThanEqual(Integer capacite);
    
    /**
     * Vérifie si une chambre existe par son numéro.
     * @param numero le numéro de la chambre
     * @return true si la chambre existe, false sinon
     */
    boolean existsByNumero(String numero);
    
    /**
     * Vérifie si une chambre existe par son numéro et son bloc.
     * @param numero le numéro de la chambre
     * @param bloc le bloc de la chambre
     * @return true si la chambre existe, false sinon
     */
    boolean existsByNumeroAndBloc(String numero, Bloc bloc);
}