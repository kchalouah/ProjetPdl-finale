package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Planning;
import tn.sesame.pdlpdl.service.IPlanningService;

import java.util.List;
@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    private final IPlanningService planningService;

    @Autowired
    public PlanningController(IPlanningService planningService) {
        this.planningService = planningService;
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
    public ResponseEntity<Planning> create(@RequestBody Planning entity) {
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
