package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Hospitalisation;
import tn.sesame.pdlpdl.service.IHospitalisationService;

import java.util.List;

@RestController
@RequestMapping("/api/hospitalisation")
public class HospitalisationController {

    private final IHospitalisationService hospitalisationService;

    @Autowired
    public HospitalisationController(IHospitalisationService hospitalisationService) {
        this.hospitalisationService = hospitalisationService;
    }

    @GetMapping("/afficherhospitalisations")
    public ResponseEntity<List<Hospitalisation>> getAll() {
        return ResponseEntity.ok(hospitalisationService.findAll());
    }

    @GetMapping("/afficherhospitalisation/{id}")
    public ResponseEntity<Hospitalisation> getById(@PathVariable Long id) {
        return hospitalisationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterhospitalisation")
    public ResponseEntity<Hospitalisation> create(@RequestBody Hospitalisation entity) {
        return ResponseEntity.ok(hospitalisationService.save(entity));
    }

    @PutMapping("/modifierhospitalisation/{id}")
    public ResponseEntity<Hospitalisation> update(@PathVariable Long id, @RequestBody Hospitalisation entity) {
        if (!hospitalisationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(hospitalisationService.save(entity));
    }

    @DeleteMapping("/supprimerhospitalisation/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!hospitalisationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hospitalisationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
