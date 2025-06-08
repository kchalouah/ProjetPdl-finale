package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Maintenance;
import tn.sesame.pdlpdl.model.enums.ResultatMaintenance;
import tn.sesame.pdlpdl.model.enums.TypeMaintenance;
import tn.sesame.pdlpdl.repository.MaintenanceRepository;
import tn.sesame.pdlpdl.service.IMaintenanceService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des maintenances.
 */
@Service
public class MaintenanceServiceImpl implements IMaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    @Autowired
    public MaintenanceServiceImpl(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public Maintenance save(Maintenance entity) {
        return maintenanceRepository.save(entity);
    }

    @Override
    public List<Maintenance> findAll() {
        return maintenanceRepository.findAll();
    }

    @Override
    public Optional<Maintenance> findById(Long id) {
        return maintenanceRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        maintenanceRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return maintenanceRepository.existsById(id);
    }

    @Override
    public List<Maintenance> findByEquipementId(Long equipementId) {
        return maintenanceRepository.findByEquipementIdOrderByDateInterventionDesc(equipementId);
    }

    @Override
    public List<Maintenance> findByTechnicienId(Long technicienId) {
        return maintenanceRepository.findByTechnicienIdOrderByDateInterventionDesc(technicienId);
    }

    @Override
    public List<Maintenance> findByType(TypeMaintenance type) {
        return maintenanceRepository.findByType(type);
    }

    @Override
    public List<Maintenance> findByResultat(ResultatMaintenance resultat) {
        return maintenanceRepository.findByResultat(resultat);
    }

    @Override
    public List<Maintenance> findByDateInterventionBetween(LocalDate dateDebut, LocalDate dateFin) {
        return maintenanceRepository.findByDateInterventionBetween(dateDebut, dateFin);
    }

    @Override
    public List<Maintenance> findMaintenancesEnCours() {
        return maintenanceRepository.findMaintenancesEnCours();
    }

    @Override
    public List<Maintenance> findLastSuccessfulMaintenance(Long equipementId) {
        return maintenanceRepository.findLastSuccessfulMaintenance(equipementId);
    }

    @Override
    public Long countMaintenancesByTechnicienAndPeriod(Long technicienId, LocalDate dateDebut, LocalDate dateFin) {
        return maintenanceRepository.countMaintenancesByTechnicienAndPeriod(technicienId, dateDebut, dateFin);
    }

    @Override
    public Double getTotalCostByPeriod(LocalDate dateDebut, LocalDate dateFin) {
        return maintenanceRepository.getTotalCostByPeriod(dateDebut, dateFin);
    }
}