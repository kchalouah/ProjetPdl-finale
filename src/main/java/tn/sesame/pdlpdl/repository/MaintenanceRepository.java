package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.Maintenance;
import tn.sesame.pdlpdl.model.enums.ResultatMaintenance;
import tn.sesame.pdlpdl.model.enums.TypeMaintenance;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByEquipementIdOrderByDateInterventionDesc(Long equipementId);

    List<Maintenance> findByTechnicienIdOrderByDateInterventionDesc(Long technicienId);

    List<Maintenance> findByType(TypeMaintenance type);

    List<Maintenance> findByResultat(ResultatMaintenance resultat);

    List<Maintenance> findByDateInterventionBetween(LocalDate dateDebut, LocalDate dateFin);

    @Query("SELECT m FROM Maintenance m WHERE m.resultat = 'EN_COURS'")
    List<Maintenance> findMaintenancesEnCours();

    @Query("SELECT m FROM Maintenance m WHERE m.equipement.id = :equipementId " +
            "AND m.resultat = 'SUCCES' ORDER BY m.dateIntervention DESC")
    List<Maintenance> findLastSuccessfulMaintenance(@Param("equipementId") Long equipementId);

    @Query("SELECT COUNT(m) FROM Maintenance m WHERE m.technicien.id = :technicienId " +
            "AND m.dateIntervention BETWEEN :dateDebut AND :dateFin")
    Long countMaintenancesByTechnicienAndPeriod(
            @Param("technicienId") Long technicienId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin
    );

    @Query("SELECT COALESCE(SUM(m.coutIntervention), 0) FROM Maintenance m " +
            "WHERE m.dateIntervention BETWEEN :dateDebut AND :dateFin")
    Double getTotalCostByPeriod(@Param("dateDebut") LocalDate dateDebut, @Param("dateFin") LocalDate dateFin);
}