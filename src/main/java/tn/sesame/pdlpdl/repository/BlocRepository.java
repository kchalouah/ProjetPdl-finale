package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Service;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour la gestion des blocs hospitaliers.
 */
@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {
    
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