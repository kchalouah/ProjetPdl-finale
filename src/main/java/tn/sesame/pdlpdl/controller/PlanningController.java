package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Planning;
import tn.sesame.pdlpdl.service.*;

import java.util.List;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    private final IPlanningService planningService;
    private final IMedecinService medecinService;
    private final IInfirmierService infirmierService;
    private final ITechnicienService technicienService;
    private final IServiceService serviceService;

    @Autowired
    public PlanningController(
            IPlanningService planningService,
            IMedecinService medecinService,
            IInfirmierService infirmierService,
            ITechnicienService technicienService,
            IServiceService serviceService
    ) {
        this.planningService = planningService;
        this.medecinService = medecinService;
        this.infirmierService = infirmierService;
        this.technicienService = technicienService;
        this.serviceService = serviceService;
    }

    @GetMapping("/lister")
    public ResponseEntity<List<Planning>> getAll() {
        return ResponseEntity.ok(planningService.findAll());
    }

    @GetMapping("/voir/{id}")
    public ResponseEntity<Planning> getById(@PathVariable Long id) {
        return planningService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/creer")
    public ResponseEntity<Planning> create(
            @RequestBody Planning entity,
            @RequestParam Long medecinId,
            @RequestParam Long infirmierId,
            @RequestParam Long technicienId,
            @RequestParam Long serviceId) {

        entity.setMedecin(medecinService.findById(medecinId).orElse(null));
        entity.setInfirmier(infirmierService.findById(infirmierId).orElse(null));
        entity.setTechnicien(technicienService.findById(technicienId).orElse(null));
        entity.setService(serviceService.findById(serviceId).orElse(null));

        return ResponseEntity.ok(planningService.save(entity));
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Planning> update(@PathVariable Long id, @RequestBody Planning entity) {
        if (!planningService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(planningService.save(entity));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!planningService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        planningService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
