package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Hospitalisation;
import tn.sesame.pdlpdl.repository.HospitalisationRepository;
import tn.sesame.pdlpdl.service.IHospitalisationService;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalisationServiceImpl implements IHospitalisationService {

    private final HospitalisationRepository hospitalisationRepository;

    @Autowired
    public HospitalisationServiceImpl(HospitalisationRepository hospitalisationRepository) {
        this.hospitalisationRepository = hospitalisationRepository;
    }

    @Override
    public Hospitalisation save(Hospitalisation entity) {
        return hospitalisationRepository.save(entity);
    }

    @Override
    public List<Hospitalisation> findAll() {
        return hospitalisationRepository.findAll();
    }

    @Override
    public Optional<Hospitalisation> findById(Long id) {
        return hospitalisationRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        hospitalisationRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return hospitalisationRepository.existsById(id);
    }
}