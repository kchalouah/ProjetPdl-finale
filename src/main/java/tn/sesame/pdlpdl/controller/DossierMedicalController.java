package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.DossierMedical;
import tn.sesame.pdlpdl.service.IDossierMedicalService;

import java.util.List;

@RestController
@RequestMapping("/api/dossiermedical")
public class DossierMedicalController {

    private final IDossierMedicalService dossiermedicalService;

    @Autowired
    public DossierMedicalController(IDossierMedicalService dossiermedicalService) {
        this.dossiermedicalService = dossiermedicalService;
    }

    @GetMapping("/afficherdossiermedicals")
    public ResponseEntity<List<DossierMedical>> getAll() {
        return ResponseEntity.ok(dossiermedicalService.findAll());
    }

    @GetMapping("/afficherdossiermedical/{id}")
    public ResponseEntity<DossierMedical> getById(@PathVariable Long id) {
        return dossiermedicalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterdossiermedical")
    public ResponseEntity<DossierMedical> create(@RequestBody DossierMedical entity) {
        return ResponseEntity.ok(dossiermedicalService.save(entity));
    }

    @PutMapping("/modifierdossiermedical/{id}")
    public ResponseEntity<DossierMedical> update(@PathVariable Long id, @RequestBody DossierMedical entity) {
        if (!dossiermedicalService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(dossiermedicalService.save(entity));
    }

    @DeleteMapping("/supprimerdossiermedical/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!dossiermedicalService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dossiermedicalService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
