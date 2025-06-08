package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.model.entities.Patient;
import tn.sesame.pdlpdl.repository.DossierMedicalRepository;
import tn.sesame.pdlpdl.service.IDossierMedicalService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des dossiers médicaux.
 */
@Service
public class DossierMedicalServiceImpl implements IDossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    public DossierMedicalServiceImpl(DossierMedicalRepository dossierMedicalRepository) {
        this.dossierMedicalRepository = dossierMedicalRepository;
    }

    @Override
    public DossierMedical save(DossierMedical entity) {
        return dossierMedicalRepository.save(entity);
    }

    @Override
    public List<DossierMedical> findAll() {
        return dossierMedicalRepository.findAll();
    }

    @Override
    public Optional<DossierMedical> findById(Long id) {
        return dossierMedicalRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        dossierMedicalRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return dossierMedicalRepository.existsById(id);
    }

    @Override
    public Optional<DossierMedical> findByPatient(Patient patient) {
        return dossierMedicalRepository.findByPatient(patient);
    }

    @Override
    public List<DossierMedical> findByDateCreationAfter(Date date) {
        return dossierMedicalRepository.findByDateCreationAfter(date);
    }

    @Override
    public List<DossierMedical> findByAntecedentsMedicauxContaining(String keyword) {
        return dossierMedicalRepository.findByAntecedentsMedicauxContaining(keyword);
    }
}