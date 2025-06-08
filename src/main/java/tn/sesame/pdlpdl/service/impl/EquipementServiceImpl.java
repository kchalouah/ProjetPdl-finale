package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Equipement;
import tn.sesame.pdlpdl.model.enums.EtatEquipement;
import tn.sesame.pdlpdl.repository.EquipementRepository;
import tn.sesame.pdlpdl.service.IEquipementService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des équipements.
 */
@Service
public class EquipementServiceImpl implements IEquipementService {

    private final EquipementRepository equipementRepository;

    @Autowired
    public EquipementServiceImpl(EquipementRepository equipementRepository) {
        this.equipementRepository = equipementRepository;
    }

    @Override
    public Equipement save(Equipement entity) {
        return equipementRepository.save(entity);
    }

    @Override
    public List<Equipement> findAll() {
        return equipementRepository.findAll();
    }

    @Override
    public Optional<Equipement> findById(Long id) {
        return equipementRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        equipementRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return equipementRepository.existsById(id);
    }

    @Override
    public Optional<Equipement> findByNumeroSerie(String numeroSerie) {
        return equipementRepository.findByNumeroSerie(numeroSerie);
    }

    @Override
    public List<Equipement> findByEtat(EtatEquipement etat) {
        return equipementRepository.findByEtat(etat);
    }

    @Override
    public List<Equipement> findByType(String type) {
        return equipementRepository.findByTypeContainingIgnoreCase(type);
    }

    @Override
    public List<Equipement> findByLocalisation(String localisation) {
        // Implement this method based on the repository method
        // Since the repository method seems to have a line break issue, we'll use a workaround
        return equipementRepository.findAll().stream()
                .filter(e -> e.getLocalisation().toLowerCase().contains(localisation.toLowerCase()))
                .toList();
    }

    @Override
    public List<Equipement> findEquipementsNecessitantMaintenance(LocalDate date) {
        return equipementRepository.findEquipementsNecessitantMaintenance(date);
    }

    @Override
    public List<Equipement> findEquipementsEnAlerte(LocalDate date) {
        return equipementRepository.findEquipementsEnAlerte(date);
    }

    @Override
    public List<Equipement> searchEquipements(String search) {
        return equipementRepository.searchEquipements(search);
    }

    @Override
    public Long countByEtat(EtatEquipement etat) {
        return equipementRepository.countByEtat(etat);
    }
}
