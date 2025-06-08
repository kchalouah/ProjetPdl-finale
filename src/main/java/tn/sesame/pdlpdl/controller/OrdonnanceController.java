package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Ordonnance;
import tn.sesame.pdlpdl.service.IOrdonnanceService;

import java.util.List;

@RestController
@RequestMapping("/api/ordonnances")
public class OrdonnanceController {

    private final IOrdonnanceService ordonnanceService;

    @Autowired
    public OrdonnanceController(IOrdonnanceService ordonnanceService) {
        this.ordonnanceService = ordonnanceService;
    }

    @GetMapping("/afficherordonnances")
    public ResponseEntity<List<Ordonnance>> getAll() {
        return ResponseEntity.ok(ordonnanceService.findAll());
    }

    @GetMapping("/afficherordonnance/{id}")
    public ResponseEntity<Ordonnance> getById(@PathVariable Long id) {
        return ordonnanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterordonnance")
    public ResponseEntity<Ordonnance> create(@RequestBody Ordonnance entity) {
        return ResponseEntity.ok(ordonnanceService.save(entity));
    }

    @PutMapping("/modifierordonnance/{id}")
    public ResponseEntity<Ordonnance> update(@PathVariable Long id, @RequestBody Ordonnance entity) {
        if (!ordonnanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(ordonnanceService.save(entity));
    }

    @DeleteMapping("/supprimerordonnance/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!ordonnanceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordonnanceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
