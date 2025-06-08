package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.model.enums.SpecialiteEnum;

import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des médecins.
 */
public interface IMedecinService extends IService<Medecin, Long> {
    
    /**
     * Recherche un médecin par son email.
     * @param email l'email du médecin
     * @return un Optional contenant le médecin s'il existe
     */
    Optional<Medecin> findByEmail(String email);
    
    /**
     * Recherche tous les médecins ayant une spécialité spécifique.
     * @param specialite la spécialité recherchée
     * @return la liste des médecins ayant cette spécialité
     */
    List<Medecin> findBySpecialite(SpecialiteEnum specialite);
}