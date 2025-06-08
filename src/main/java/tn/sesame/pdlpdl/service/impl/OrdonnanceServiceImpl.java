package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Ordonnance;
import tn.sesame.pdlpdl.repository.OrdonnanceRepository;
import tn.sesame.pdlpdl.service.IOrdonnanceService;

import java.util.List;
import java.util.Optional;

@Service
public class OrdonnanceServiceImpl implements IOrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;

    @Autowired
    public OrdonnanceServiceImpl(OrdonnanceRepository ordonnanceRepository) {
        this.ordonnanceRepository = ordonnanceRepository;
    }

    @Override
    public Ordonnance save(Ordonnance entity) {
        return ordonnanceRepository.save(entity);
    }

    @Override
    public List<Ordonnance> findAll() {
        return ordonnanceRepository.findAll();
    }

    @Override
    public Optional<Ordonnance> findById(Long id) {
        return ordonnanceRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        ordonnanceRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return ordonnanceRepository.existsById(id);
    }
}