package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Infirmier;
import tn.sesame.pdlpdl.service.IInfirmierService;

import java.util.List;

@RestController
@RequestMapping("/api/infirmier")
public class InfirmierController {

    private final IInfirmierService infirmierService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public InfirmierController(IInfirmierService infirmierService, PasswordEncoder passwordEncoder) {
        this.infirmierService = infirmierService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/afficherinfirmiers")
    public ResponseEntity<List<Infirmier>> getAll() {
        return ResponseEntity.ok(infirmierService.findAll());
    }

    @GetMapping("/afficherinfirmier/{id}")
    public ResponseEntity<Infirmier> getById(@PathVariable Long id) {
        return infirmierService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterinfirmier")
    public ResponseEntity<Infirmier> create(@RequestBody Infirmier entity) {
        if (entity.getMotDePasse() != null && !entity.getMotDePasse().trim().isEmpty()) {
            String pwd = entity.getMotDePasse();
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                entity.setMotDePasse(passwordEncoder.encode(pwd));
            } else {
                entity.setMotDePasse(pwd);
            }
        }
        return ResponseEntity.ok(infirmierService.save(entity));
    }

    @PutMapping("/modifierinfirmier/{id}")
    public ResponseEntity<Infirmier> update(@PathVariable Long id, @RequestBody Infirmier entity) {
        if (!infirmierService.existsById(id)) {
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
        return ResponseEntity.ok(infirmierService.save(entity));
    }

    @DeleteMapping("/supprimerinfirmier/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!infirmierService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        infirmierService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}