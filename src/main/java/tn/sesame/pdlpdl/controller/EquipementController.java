package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Equipement;
import tn.sesame.pdlpdl.model.enums.EtatEquipement;
import tn.sesame.pdlpdl.service.IEquipementService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des équipements.
 */
@RestController
@RequestMapping("/api/equipement")
public class EquipementController {

    private final IEquipementService equipementService;

    @Autowired
    public EquipementController(IEquipementService equipementService) {
        this.equipementService = equipementService;
    }

    // GET: Afficher tous les équipements
    @GetMapping("/getall")
    public ResponseEntity<List<Equipement>> getAllEquipements() {
        return ResponseEntity.ok(equipementService.findAll());
    }

    // GET: Afficher un équipement par ID
    @GetMapping("/getbyid{id}")
    public ResponseEntity<Equipement> getEquipementById(@PathVariable Long id) {
        return equipementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Afficher un équipement par numéro de série
    @GetMapping("/serie/{numeroSerie}")
    public ResponseEntity<Equipement> getEquipementByNumeroSerie(@PathVariable String numeroSerie) {
        return equipementService.findByNumeroSerie(numeroSerie)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Afficher les équipements par état
    @GetMapping("/etat/{etat}")
    public ResponseEntity<List<Equipement>> getEquipementsByEtat(@PathVariable EtatEquipement etat) {
        return ResponseEntity.ok(equipementService.findByEtat(etat));
    }

    // GET: Afficher les équipements par type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Equipement>> getEquipementsByType(@PathVariable String type) {
        return ResponseEntity.ok(equipementService.findByType(type));
    }

    // GET: Afficher les équipements par localisation
    @GetMapping("/localisation/{localisation}")
    public ResponseEntity<List<Equipement>> getEquipementsByLocalisation(@PathVariable String localisation) {
        return ResponseEntity.ok(equipementService.findByLocalisation(localisation));
    }

    // GET: Afficher les équipements nécessitant une maintenance
    @GetMapping("/maintenance-necessaire")
    public ResponseEntity<List<Equipement>> getEquipementsNecessitantMaintenance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate dateReference = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(equipementService.findEquipementsNecessitantMaintenance(dateReference));
    }

    // GET: Afficher les équipements en alerte
    @GetMapping("/alerte")
    public ResponseEntity<List<Equipement>> getEquipementsEnAlerte(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate dateReference = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(equipementService.findEquipementsEnAlerte(dateReference));
    }

    // GET: Rechercher des équipements
    @GetMapping("/search")
    public ResponseEntity<List<Equipement>> searchEquipements(@RequestParam String query) {
        return ResponseEntity.ok(equipementService.searchEquipements(query));
    }

    // GET: Compter les équipements par état
    @GetMapping("/count/etat/{etat}")
    public ResponseEntity<Long> countEquipementsByEtat(@PathVariable EtatEquipement etat) {
        return ResponseEntity.ok(equipementService.countByEtat(etat));
    }

    // POST: Ajouter un équipement
    @PostMapping("/add")
    public ResponseEntity<Equipement> createEquipement(@RequestBody Equipement equipement) {
        // Vérifier si un équipement avec le même numéro de série existe déjà
        if (equipementService.findByNumeroSerie(equipement.getNumeroSerie()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(equipementService.save(equipement));
    }

    // PUT: Modifier un équipement
    @PutMapping("/{id}")
    public ResponseEntity<Equipement> updateEquipement(@PathVariable Long id, @RequestBody Equipement equipement) {
        if (!equipementService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Vérifier si le numéro de série est déjà utilisé par un autre équipement
        Optional<Equipement> existingEquipement = equipementService.findByNumeroSerie(equipement.getNumeroSerie());
        if (existingEquipement.isPresent() && !existingEquipement.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        equipement.setId(id);
        return ResponseEntity.ok(equipementService.save(equipement));
    }

    // DELETE: Supprimer un équipement
    @DeleteMapping("supprimerequi/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        if (!equipementService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipementService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH: Mettre à jour l'état d'un équipement
    @PatchMapping("/{id}/etat")
    public ResponseEntity<Equipement> updateEquipementEtat(
            @PathVariable Long id, 
            @RequestParam EtatEquipement etat) {
        return equipementService.findById(id)
                .map(equipement -> {
                    equipement.setEtat(etat);
                    return ResponseEntity.ok(equipementService.save(equipement));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
