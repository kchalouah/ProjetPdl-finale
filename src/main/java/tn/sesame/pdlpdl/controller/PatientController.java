package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Patient;
import tn.sesame.pdlpdl.service.IPatientService;

import java.util.List;
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final IPatientService patientService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PatientController(IPatientService patientService, PasswordEncoder passwordEncoder) {
        this.patientService = patientService;
        this.passwordEncoder = passwordEncoder;
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
        if (entity.getMotDePasse() != null && !entity.getMotDePasse().trim().isEmpty()) {
            String pwd = entity.getMotDePasse();
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                entity.setMotDePasse(passwordEncoder.encode(pwd));
            } else {
                entity.setMotDePasse(pwd);
            }
        }
        return ResponseEntity.ok(patientService.save(entity));
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient entity) {
        if (!patientService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (entity.getMotDePasse() != null && !entity.getMotDePasse().trim().isEmpty()) {
            String pwd = entity.getMotDePasse();
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                entity.setMotDePasse(passwordEncoder.encode(pwd));
            } else {
                entity.setMotDePasse(pwd);
            }
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
    @GetMapping("/by-email")
    public ResponseEntity<Patient> getByEmail(@RequestParam String email) {
        return patientService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}