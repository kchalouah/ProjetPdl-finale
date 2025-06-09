package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.model.entities.Patient;
import tn.sesame.pdlpdl.repository.ConsultationRepository;
import tn.sesame.pdlpdl.service.IConsultationService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationServiceImpl implements IConsultationService {

    private final ConsultationRepository consultationRepository;

    @Autowired
    public ConsultationServiceImpl(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    @Override
    public Consultation save(Consultation entity) {
        return consultationRepository.save(entity);
    }

    @Override
    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    @Override
    public Optional<Consultation> findById(Long id) {
        return consultationRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return consultationRepository.existsById(id);
    }

    @Override
    public List<Consultation> findByMedecin(Medecin medecin) {
        return consultationRepository.findByMedecin(medecin);
    }

    @Override
    public List<Consultation> findByPatient(Patient patient) {
        return consultationRepository.findByPatient(patient);
    }

    @Override
    public List<Consultation> findByMedecinAndPatient(Medecin medecin, Patient patient) {
        return consultationRepository.findByMedecinAndPatient(medecin, patient);
    }

    @Override
    public List<Consultation> findByDateHeureAfter(Date date) {
        return consultationRepository.findByDateHeureAfter(date);
    }

    @Override
    public List<Consultation> findByDateHeureBetween(Date debut, Date fin) {
        return consultationRepository.findByDateHeureBetween(debut, fin);
    }
}
