package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.pdlpdl.model.entities.*;
import tn.sesame.pdlpdl.model.enums.JourEnum;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface PlanningRepository extends JpaRepository<Planning, Long> {

    // Recherche par MEDecin
    List<Planning> findByMedecin(Medecin medecin);
    List<Planning> findByMedecinAndJour(Medecin medecin, JourEnum jour);

    // Recherche par INFIRMIER
    List<Planning> findByInfirmier(Infirmier infirmier);
    List<Planning> findByInfirmierAndJour(Infirmier infirmier, JourEnum jour);

    // Recherche par TECHNICIEN
    List<Planning> findByTechnicien(Technicien technicien);
    List<Planning> findByTechnicienAndJour(Technicien technicien, JourEnum jour);

    // Recherche par jour
    List<Planning> findByJour(JourEnum jour);

    // Plannings après une heure donnée
    List<Planning> findByHeureDebutAfter(LocalTime heure);

    // Plannings avant une heure donnée
    List<Planning> findByHeureFinBefore(LocalTime heure);

    // Par jour et heure de début
    List<Planning> findByJourAndHeureDebutAfter(JourEnum jour, LocalTime heure);
}
