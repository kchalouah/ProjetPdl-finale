package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Administrateur;

import java.util.Optional;

/**
 * Repository pour la gestion des administrateurs.
 */
@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
    
    /**
     * Recherche un administrateur par son email.
     * @param email l'email de l'administrateur
     * @return un Optional contenant l'administrateur s'il existe
     */
    Optional<Administrateur> findByEmail(String email);
}