package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.*;

import java.util.Date;
import java.util.List;

/**
 * Repository pour la gestion des hospitalisations.
 */
@Repository
public interface HospitalisationRepository extends JpaRepository<Hospitalisation, Long> {
    
    /**
     * Recherche toutes les hospitalisations d'un patient spécifique.
     * @param patient le patient recherché
     * @return la liste des hospitalisations de ce patient
     */
    List<Hospitalisation> findByPatient(Patient patient);
    
    /**
     * Recherche toutes les hospitalisations dans un service spécifique.
     * @param service le service recherché
     * @return la liste des hospitalisations dans ce service
     */
    List<Hospitalisation> findByService(Service service);
    
    /**
     * Recherche toutes les hospitalisations dans un bloc spécifique.
     * @param bloc le bloc recherché
     * @return la liste des hospitalisations dans ce bloc
     */
    List<Hospitalisation> findByBloc(Bloc bloc);
    
    /**
     * Recherche toutes les hospitalisations dans une chambre spécifique.
     * @param chambre la chambre recherchée
     * @return la liste des hospitalisations dans cette chambre
     */
    List<Hospitalisation> findByChambre(Chambre chambre);
    
    /**
     * Recherche toutes les hospitalisations en cours (sans date de sortie).
     * @return la liste des hospitalisations en cours
     */
    List<Hospitalisation> findByDateSortieIsNull();
    
    /**
     * Recherche toutes les hospitalisations commencées après une date spécifique.
     * @param date la date minimale d'entrée
     * @return la liste des hospitalisations commencées après cette date
     */
    List<Hospitalisation> findByDateEntreeAfter(Date date);
    
    /**
     * Recherche toutes les hospitalisations terminées avant une date spécifique.
     * @param date la date maximale de sortie
     * @return la liste des hospitalisations terminées avant cette date
     */
    List<Hospitalisation> findByDateSortieBefore(Date date);
    
    /**
     * Recherche toutes les hospitalisations en cours dans un service spécifique.
     * @param service le service recherché
     * @return la liste des hospitalisations en cours dans ce service
     */
    List<Hospitalisation> findByServiceAndDateSortieIsNull(Service service);
}