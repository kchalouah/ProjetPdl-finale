package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Service;
import tn.sesame.pdlpdl.model.entities.Technicien;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour la gestion des techniciens.
 */
@Repository
public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
    
    /**
     * Recherche un technicien par son email.
     * @param email l'email du technicien
     * @return un Optional contenant le technicien s'il existe
     */
    Optional<Technicien> findByEmail(String email);
    
    /**
     * Recherche tous les techniciens affectés à un service spécifique.
     * @param service le service recherché
     * @return la liste des techniciens affectés à ce service
     */
    List<Technicien> findByService(Service service);
    
    /**
     * Recherche tous les techniciens affectés à un bloc spécifique.
     * @param bloc le bloc recherché
     * @return la liste des techniciens affectés à ce bloc
     */
    List<Technicien> findByBloc(Bloc bloc);
    
    /**
     * Recherche tous les techniciens affectés à un service et un bloc spécifiques.
     * @param service le service recherché
     * @param bloc le bloc recherché
     * @return la liste des techniciens affectés à ce service et ce bloc
     */
    List<Technicien> findByServiceAndBloc(Service service, Bloc bloc);
}