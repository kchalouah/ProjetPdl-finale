package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Administrateur;
import tn.sesame.pdlpdl.repository.AdministrateurRepository;
import tn.sesame.pdlpdl.service.IAdministrateurService;

import java.util.List;
import java.util.Optional;

@Service
public class AdministrateurServiceImpl implements IAdministrateurService {

    private final AdministrateurRepository administrateurRepository;

    @Autowired
    public AdministrateurServiceImpl(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    @Override
    public Administrateur save(Administrateur entity) {
        return administrateurRepository.save(entity);
    }

    @Override
    public List<Administrateur> findAll() {
        return administrateurRepository.findAll();
    }

    @Override
    public Optional<Administrateur> findById(Long id) {
        return administrateurRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        administrateurRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return administrateurRepository.existsById(id);
    }
}