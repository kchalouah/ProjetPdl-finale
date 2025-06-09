package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Patient;
import java.util.Optional;

public interface IPatientService extends IService<Patient, Long> {
    // Méthodes spécifiques à Patient à ajouter ici
    Optional<Patient> findByEmail(String email);
}
