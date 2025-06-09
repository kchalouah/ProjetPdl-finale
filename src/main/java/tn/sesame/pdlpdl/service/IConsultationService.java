package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.model.entities.Patient;

import java.util.Date;
import java.util.List;

public interface IConsultationService extends IService<Consultation, Long> {

    List<Consultation> findByMedecin(Medecin medecin);

    List<Consultation> findByPatient(Patient patient);

    List<Consultation> findByMedecinAndPatient(Medecin medecin, Patient patient);

    List<Consultation> findByDateHeureAfter(Date date);

    List<Consultation> findByDateHeureBetween(Date debut, Date fin);
}
