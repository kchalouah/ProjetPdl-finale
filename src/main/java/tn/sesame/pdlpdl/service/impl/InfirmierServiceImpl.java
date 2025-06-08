package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Infirmier;
import tn.sesame.pdlpdl.repository.InfirmierRepository;
import tn.sesame.pdlpdl.service.IInfirmierService;

import java.util.List;
import java.util.Optional;

@Service
public class InfirmierServiceImpl implements IInfirmierService {

    private final InfirmierRepository infirmierRepository;

    @Autowired
    public InfirmierServiceImpl(InfirmierRepository infirmierRepository) {
        this.infirmierRepository = infirmierRepository;
    }

    @Override
    public Infirmier save(Infirmier entity) {
        return infirmierRepository.save(entity);
    }

    @Override
    public List<Infirmier> findAll() {
        return infirmierRepository.findAll();
    }

    @Override
    public Optional<Infirmier> findById(Long id) {
        return infirmierRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        infirmierRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return infirmierRepository.existsById(id);
    }
}