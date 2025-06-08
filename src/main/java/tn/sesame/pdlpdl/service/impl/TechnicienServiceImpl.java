package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Technicien;
import tn.sesame.pdlpdl.repository.TechnicienRepository;
import tn.sesame.pdlpdl.service.ITechnicienService;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicienServiceImpl implements ITechnicienService {

    private final TechnicienRepository technicienRepository;

    @Autowired
    public TechnicienServiceImpl(TechnicienRepository technicienRepository) {
        this.technicienRepository = technicienRepository;
    }

    @Override
    public Technicien save(Technicien entity) {
        return technicienRepository.save(entity);
    }

    @Override
    public List<Technicien> findAll() {
        return technicienRepository.findAll();
    }

    @Override
    public Optional<Technicien> findById(Long id) {
        return technicienRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        technicienRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return technicienRepository.existsById(id);
    }
}