package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Medecin;
import tn.sesame.pdlpdl.service.IMedecinService;

import java.util.List;

@RestController
@RequestMapping("/api/medecin")
public class MedecinController {

    private final IMedecinService medecinService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public MedecinController(IMedecinService medecinService, PasswordEncoder passwordEncoder) {
        this.medecinService = medecinService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/affichermedecins")
    public ResponseEntity<List<Medecin>> getAll() {
        return ResponseEntity.ok(medecinService.findAll());
    }

    @GetMapping("/affichermedecin/{id}")
    public ResponseEntity<Medecin> getById(@PathVariable Long id) {
        return medecinService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajoutermedecin")
    public ResponseEntity<Medecin> create(@RequestBody Medecin entity) {
        if (entity.getMotDePasse() != null && !entity.getMotDePasse().trim().isEmpty()) {
            String pwd = entity.getMotDePasse();
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                entity.setMotDePasse(passwordEncoder.encode(pwd));
            } else {
                entity.setMotDePasse(pwd);
            }
        }
        return ResponseEntity.ok(medecinService.save(entity));
    }

    @PutMapping("/modifiermedecin/{id}")
    public ResponseEntity<Medecin> update(@PathVariable Long id, @RequestBody Medecin entity) {
        if (!medecinService.existsById(id)) {
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
        return ResponseEntity.ok(medecinService.save(entity));
    }

    @DeleteMapping("/supprimermedecin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!medecinService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        medecinService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}