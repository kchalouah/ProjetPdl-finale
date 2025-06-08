package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour la gestion des patients.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    /**
     * Recherche un patient par son email.
     * @param email l'email du patient
     * @return un Optional contenant le patient s'il existe
     */
    Optional<Patient> findByEmail(String email);
    
    /**
     * Recherche un patient par son dossier médical.
     * @param dossierMedical le dossier médical du patient
     * @return un Optional contenant le patient s'il existe
     */
    Optional<Patient> findByDossierMedical(DossierMedical dossierMedical);
    
    /**
     * Recherche tous les patients nés après une date spécifique.
     * @param date la date de naissance minimale
     * @return la liste des patients nés après cette date
     */
    List<Patient> findByDateNaissanceAfter(Date date);
    
    /**
     * Recherche tous les patients par nom ou prénom.
     * @param nom le nom recherché
     * @param prenom le prénom recherché
     * @return la liste des patients correspondants
     */
    List<Patient> findByNomContainingOrPrenomContaining(String nom, String prenom);
}