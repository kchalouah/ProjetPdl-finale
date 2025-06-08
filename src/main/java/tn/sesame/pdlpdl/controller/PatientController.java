package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Patient;
import tn.sesame.pdlpdl.service.IPatientService;

import java.util.List;
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final IPatientService patientService;

    @Autowired
    public PatientController(IPatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/lister")
    public ResponseEntity<List<Patient>> getAll() {
        return ResponseEntity.ok(patientService.findAll());
    }

    @GetMapping("/voir/{id}")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        return patientService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/creer")
    public ResponseEntity<Patient> create(@RequestBody Patient entity) {
        return ResponseEntity.ok(patientService.save(entity));
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient entity) {
        if (!patientService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(patientService.save(entity));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!patientService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        patientService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
