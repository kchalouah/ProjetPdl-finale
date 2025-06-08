package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.repository.BlocRepository;
import tn.sesame.pdlpdl.service.IBlocService;

import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des blocs hospitaliers.
 */
@Service
public class BlocServiceImpl implements IBlocService {

    private final BlocRepository blocRepository;

    @Autowired
    public BlocServiceImpl(BlocRepository blocRepository) {
        this.blocRepository = blocRepository;
    }

    @Override
    public Bloc save(Bloc entity) {
        return blocRepository.save(entity);
    }

    @Override
    public List<Bloc> findAll() {
        return blocRepository.findAll();
    }

    @Override
    public Optional<Bloc> findById(Long id) {
        return blocRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        blocRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return blocRepository.existsById(id);
    }

    @Override
    public Optional<Bloc> findByNumero(String numero) {
        return blocRepository.findByNumero(numero);
    }

    @Override
    public List<Bloc> findByService(tn.sesame.pdlpdl.model.entities.Service service) {
        return blocRepository.findByService(service);
    }

    @Override
    public boolean existsByNumero(String numero) {
        return blocRepository.existsByNumero(numero);
    }

    @Override
    public boolean existsByNumeroAndService(String numero, tn.sesame.pdlpdl.model.entities.Service service) {
        return blocRepository.existsByNumeroAndService(numero, service);
    }
}