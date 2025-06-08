package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Infirmier;
import tn.sesame.pdlpdl.model.entities.Service;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour la gestion des infirmiers.
 */
@Repository
public interface InfirmierRepository extends JpaRepository<Infirmier, Long> {
    
    /**
     * Recherche un infirmier par son email.
     * @param email l'email de l'infirmier
     * @return un Optional contenant l'infirmier s'il existe
     */
    Optional<Infirmier> findByEmail(String email);
    
    /**
     * Recherche tous les infirmiers affectés à un service spécifique.
     * @param service le service recherché
     * @return la liste des infirmiers affectés à ce service
     */
    List<Infirmier> findByService(Service service);
    
    /**
     * Recherche tous les infirmiers affectés à un bloc spécifique.
     * @param bloc le bloc recherché
     * @return la liste des infirmiers affectés à ce bloc
     */
    List<Infirmier> findByBloc(Bloc bloc);
    
    /**
     * Recherche tous les infirmiers affectés à un service et un bloc spécifiques.
     * @param service le service recherché
     * @param bloc le bloc recherché
     * @return la liste des infirmiers affectés à ce service et ce bloc
     */
    List<Infirmier> findByServiceAndBloc(Service service, Bloc bloc);
}