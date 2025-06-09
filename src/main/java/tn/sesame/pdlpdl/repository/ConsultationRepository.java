package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByMedecin(Medecin medecin);

    List<Consultation> findByPatient(Patient patient);

    List<Consultation> findByMedecinAndPatient(Medecin medecin, Patient patient);

    List<Consultation> findByDateHeureAfter(Date date);

    List<Consultation> findByDateHeureBetween(Date debut, Date fin);
}
