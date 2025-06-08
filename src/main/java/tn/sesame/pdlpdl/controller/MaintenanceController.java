package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Equipement;
import tn.sesame.pdlpdl.model.entities.Maintenance;
import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.model.enums.ResultatMaintenance;
import tn.sesame.pdlpdl.model.enums.TypeMaintenance;
import tn.sesame.pdlpdl.service.IEquipementService;
import tn.sesame.pdlpdl.service.IMaintenanceService;
import tn.sesame.pdlpdl.service.IUtilisateurService;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrôleur REST pour la gestion des maintenances.
 */
@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final IMaintenanceService maintenanceService;
    private final IEquipementService equipementService;
    private final IUtilisateurService utilisateurService;

    @Autowired
    public MaintenanceController(
            IMaintenanceService maintenanceService,
            IEquipementService equipementService,
            IUtilisateurService utilisateurService) {
        this.maintenanceService = maintenanceService;
        this.equipementService = equipementService;
        this.utilisateurService = utilisateurService;
    }

    // GET: Afficher toutes les maintenances
    @GetMapping("/maint-get-all")
    public ResponseEntity<List<Maintenance>> getAllMaintenances() {
        return ResponseEntity.ok(maintenanceService.findAll());
    }

    // GET: Afficher une maintenance par ID
    @GetMapping("/maitenanace/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        return maintenanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Afficher les maintenances d'un équipement
    @GetMapping("/equipement/{equipementId}")
    public ResponseEntity<List<Maintenance>> getMaintenancesByEquipement(@PathVariable Long equipementId) {
        if (!equipementService.existsById(equipementId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenanceService.findByEquipementId(equipementId));
    }

    // GET: Afficher les maintenances effectuées par un technicien
    @GetMapping("/technicien/{technicienId}")
    public ResponseEntity<List<Maintenance>> getMaintenancesByTechnicien(@PathVariable Long technicienId) {
        if (!utilisateurService.existsById(technicienId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenanceService.findByTechnicienId(technicienId));
    }

    // GET: Afficher les maintenances par type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Maintenance>> getMaintenancesByType(@PathVariable TypeMaintenance type) {
        return ResponseEntity.ok(maintenanceService.findByType(type));
    }

    // GET: Afficher les maintenances par résultat
    @GetMapping("/resultat/{resultat}")
    public ResponseEntity<List<Maintenance>> getMaintenancesByResultat(@PathVariable ResultatMaintenance resultat) {
        return ResponseEntity.ok(maintenanceService.findByResultat(resultat));
    }

    // GET: Afficher les maintenances entre deux dates
    @GetMapping("/periode")
    public ResponseEntity<List<Maintenance>> getMaintenancesByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(maintenanceService.findByDateInterventionBetween(dateDebut, dateFin));
    }

    // GET: Afficher les maintenances en cours
    @GetMapping("/en-cours")
    public ResponseEntity<List<Maintenance>> getMaintenancesEnCours() {
        return ResponseEntity.ok(maintenanceService.findMaintenancesEnCours());
    }

    // GET: Afficher la dernière maintenance réussie d'un équipement
    @GetMapping("/derniere-reussie/{equipementId}")
    public ResponseEntity<List<Maintenance>> getLastSuccessfulMaintenance(@PathVariable Long equipementId) {
        if (!equipementService.existsById(equipementId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenanceService.findLastSuccessfulMaintenance(equipementId));
    }

    // GET: Compter les maintenances effectuées par un technicien sur une période
    @GetMapping("/count/technicien/{technicienId}")
    public ResponseEntity<Long> countMaintenancesByTechnicienAndPeriod(
            @PathVariable Long technicienId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        if (!utilisateurService.existsById(technicienId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(maintenanceService.countMaintenancesByTechnicienAndPeriod(technicienId, dateDebut, dateFin));
    }

    // GET: Calculer le coût total des maintenances sur une période
    @GetMapping("/cout-total")
    public ResponseEntity<Double> getTotalCostByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return ResponseEntity.ok(maintenanceService.getTotalCostByPeriod(dateDebut, dateFin));
    }

    // POST: Ajouter une maintenance
    @PostMapping("ajoutermant/add")
    public ResponseEntity<Maintenance> createMaintenance(
            @RequestBody Maintenance maintenance,
            @RequestParam Long equipementId,
            @RequestParam Long technicienId) {
        
        // Vérifier si l'équipement existe
        return equipementService.findById(equipementId)
                .map(equipement -> {
                    // Vérifier si le technicien existe
                    return utilisateurService.findById(technicienId)
                            .map(technicien -> {
                                maintenance.setEquipement(equipement);
                                maintenance.setTechnicien(technicien);
                                Maintenance savedMaintenance = maintenanceService.save(maintenance);
                                return ResponseEntity.status(HttpStatus.CREATED).body(savedMaintenance);
                            })
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT: Modifier une maintenance
    @PutMapping("mofidymaint/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(
            @PathVariable Long id,
            @RequestBody Maintenance maintenance,
            @RequestParam(required = false) Long equipementId,
            @RequestParam(required = false) Long technicienId) {
        
        if (!maintenanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        maintenance.setId(id);
        
        // Récupérer la maintenance existante
        return maintenanceService.findById(id)
                .map(existingMaintenance -> {
                    // Si equipementId est fourni, mettre à jour l'équipement
                    if (equipementId != null) {
                        return equipementService.findById(equipementId)
                                .map(equipement -> {
                                    maintenance.setEquipement(equipement);
                                    // Si technicienId est fourni, mettre à jour le technicien
                                    if (technicienId != null) {
                                        return updateTechnicien(maintenance, technicienId);
                                    } else {
                                        maintenance.setTechnicien(existingMaintenance.getTechnicien());
                                        return ResponseEntity.ok(maintenanceService.save(maintenance));
                                    }
                                })
                                .orElse(ResponseEntity.notFound().build());
                    } 
                    // Si equipementId n'est pas fourni mais technicienId l'est
                    else if (technicienId != null) {
                        maintenance.setEquipement(existingMaintenance.getEquipement());
                        return updateTechnicien(maintenance, technicienId);
                    } 
                    // Si ni equipementId ni technicienId ne sont fournis
                    else {
                        maintenance.setEquipement(existingMaintenance.getEquipement());
                        maintenance.setTechnicien(existingMaintenance.getTechnicien());
                        return ResponseEntity.ok(maintenanceService.save(maintenance));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Méthode utilitaire pour mettre à jour le technicien
    private ResponseEntity<Maintenance> updateTechnicien(Maintenance maintenance, Long technicienId) {
        return utilisateurService.findById(technicienId)
                .map(technicien -> {
                    maintenance.setTechnicien(technicien);
                    return ResponseEntity.ok(maintenanceService.save(maintenance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH: Mettre à jour le résultat d'une maintenance
    @PatchMapping("/{id}/resultat")
    public ResponseEntity<Maintenance> updateMaintenanceResultat(
            @PathVariable Long id,
            @RequestParam ResultatMaintenance resultat) {
        return maintenanceService.findById(id)
                .map(maintenance -> {
                    maintenance.setResultat(resultat);
                    return ResponseEntity.ok(maintenanceService.save(maintenance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Supprimer une maintenance
    @DeleteMapping("/supprimermant/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        if (!maintenanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        maintenanceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}