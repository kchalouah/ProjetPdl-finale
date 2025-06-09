package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Administrateur;
import tn.sesame.pdlpdl.service.IAdministrateurService;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // plus simple et explicite
public class AdministrateurController {

    private final IAdministrateurService administrateurService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdministrateurController(IAdministrateurService administrateurService, PasswordEncoder passwordEncoder) {
        this.administrateurService = administrateurService;
        this.passwordEncoder = passwordEncoder;
    }

    // GET: afficher tous les admins
    @GetMapping("/afficheradmins")
    public ResponseEntity<List<Administrateur>> getAll() {
        return ResponseEntity.ok(administrateurService.findAll());
    }

    // GET: afficher un admin par ID
    @GetMapping("/afficheradmin/{id}")
    public ResponseEntity<Administrateur> getById(@PathVariable Long id) {
        return administrateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: ajouter un admin
    @PostMapping("/ajouteradmin")
    public ResponseEntity<Administrateur> create(@RequestBody Administrateur entity) {
        if (entity.getMotDePasse() != null && !entity.getMotDePasse().trim().isEmpty()) {
            String pwd = entity.getMotDePasse();
            if (!(pwd.startsWith("$2a$") || pwd.startsWith("$2b$") || pwd.startsWith("$2y$"))) {
                entity.setMotDePasse(passwordEncoder.encode(pwd));
            } else {
                entity.setMotDePasse(pwd);
            }
        }
        return ResponseEntity.ok(administrateurService.save(entity));
    }

    // PUT: modifier un admin
    @PutMapping("/modifieradmin/{id}")
    public ResponseEntity<Administrateur> update(@PathVariable Long id, @RequestBody Administrateur entity) {
        if (!administrateurService.existsById(id)) {
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
        return ResponseEntity.ok(administrateurService.save(entity));
    }

    // DELETE: supprimer un admin
    @DeleteMapping("/supprimeradmin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!administrateurService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        administrateurService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}