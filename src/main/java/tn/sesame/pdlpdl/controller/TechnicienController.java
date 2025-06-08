package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Technicien;
import tn.sesame.pdlpdl.service.ITechnicienService;

import java.util.List;
@RestController
@RequestMapping("/api/techniciens")
public class TechnicienController {

    private final ITechnicienService technicienService;

    @Autowired
    public TechnicienController(ITechnicienService technicienService) {
        this.technicienService = technicienService;
    }

    @GetMapping("/lister")
    public ResponseEntity<List<Technicien>> getAll() {
        return ResponseEntity.ok(technicienService.findAll());
    }

    @GetMapping("/voir/{id}")
    public ResponseEntity<Technicien> getById(@PathVariable Long id) {
        return technicienService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/creer")
    public ResponseEntity<Technicien> create(@RequestBody Technicien entity) {
        return ResponseEntity.ok(technicienService.save(entity));
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Technicien> update(@PathVariable Long id, @RequestBody Technicien entity) {
        if (!technicienService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(technicienService.save(entity));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!technicienService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        technicienService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
