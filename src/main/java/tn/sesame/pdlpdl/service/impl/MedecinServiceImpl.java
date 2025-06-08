package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.model.enums.SpecialiteEnum;
import tn.sesame.pdlpdl.repository.MedecinRepository;
import tn.sesame.pdlpdl.service.IMedecinService;

import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des médecins.
 */
@Service
public class MedecinServiceImpl implements IMedecinService {

    private final MedecinRepository medecinRepository;

    @Autowired
    public MedecinServiceImpl(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    @Override
    public Medecin save(Medecin entity) {
        return medecinRepository.save(entity);
    }

    @Override
    public List<Medecin> findAll() {
        return medecinRepository.findAll();
    }

    @Override
    public Optional<Medecin> findById(Long id) {
        return medecinRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        medecinRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return medecinRepository.existsById(id);
    }

    @Override
    public Optional<Medecin> findByEmail(String email) {
        return medecinRepository.findByEmail(email);
    }

    @Override
    public List<Medecin> findBySpecialite(SpecialiteEnum specialite) {
        return medecinRepository.findBySpecialite(specialite);
    }
}