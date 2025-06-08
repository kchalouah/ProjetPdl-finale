package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Chambre;
import tn.sesame.pdlpdl.repository.ChambreRepository;
import tn.sesame.pdlpdl.service.IChambreService;

import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des chambres hospitalières.
 */
@Service
public class ChambreServiceImpl implements IChambreService {

    private final ChambreRepository chambreRepository;

    @Autowired
    public ChambreServiceImpl(ChambreRepository chambreRepository) {
        this.chambreRepository = chambreRepository;
    }

    @Override
    public Chambre save(Chambre entity) {
        return chambreRepository.save(entity);
    }

    @Override
    public List<Chambre> findAll() {
        return chambreRepository.findAll();
    }

    @Override
    public Optional<Chambre> findById(Long id) {
        return chambreRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        chambreRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return chambreRepository.existsById(id);
    }

    @Override
    public Optional<Chambre> findByNumero(String numero) {
        return chambreRepository.findByNumero(numero);
    }

    @Override
    public List<Chambre> findByBloc(Bloc bloc) {
        return chambreRepository.findByBloc(bloc);
    }

    @Override
    public List<Chambre> findByCapaciteGreaterThanEqual(Integer capacite) {
        return chambreRepository.findByCapaciteGreaterThanEqual(capacite);
    }

    @Override
    public boolean existsByNumero(String numero) {
        return chambreRepository.existsByNumero(numero);
    }

    @Override
    public boolean existsByNumeroAndBloc(String numero, Bloc bloc) {
        return chambreRepository.existsByNumeroAndBloc(numero, bloc);
    }
}