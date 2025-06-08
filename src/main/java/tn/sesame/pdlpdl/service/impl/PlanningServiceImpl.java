package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Planning;
import tn.sesame.pdlpdl.repository.PlanningRepository;
import tn.sesame.pdlpdl.service.IPlanningService;

import java.util.List;
import java.util.Optional;

@Service
public class PlanningServiceImpl implements IPlanningService {

    private final PlanningRepository planningRepository;

    @Autowired
    public PlanningServiceImpl(PlanningRepository planningRepository) {
        this.planningRepository = planningRepository;
    }

    @Override
    public Planning save(Planning entity) {
        return planningRepository.save(entity);
    }

    @Override
    public List<Planning> findAll() {
        return planningRepository.findAll();
    }

    @Override
    public Optional<Planning> findById(Long id) {
        return planningRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        planningRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return planningRepository.existsById(id);
    }
}