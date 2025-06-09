package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.sesame.pdlpdl.model.entities.Patient;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
}
