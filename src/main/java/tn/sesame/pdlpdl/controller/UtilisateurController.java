package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.*;
import tn.sesame.pdlpdl.model.enums.RoleEnum;
import tn.sesame.pdlpdl.model.enums.SpecialiteEnum;
import tn.sesame.pdlpdl.service.IUtilisateurService;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des utilisateurs.
 */
@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final IUtilisateurService utilisateurService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UtilisateurController(IUtilisateurService utilisateurService, PasswordEncoder passwordEncoder) {
        this.utilisateurService = utilisateurService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/tous")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }

    @GetMapping("/par-id/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        return utilisateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/par-email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        return utilisateurService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/par-role/{role}")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByRole(@PathVariable RoleEnum role) {
        return ResponseEntity.ok(utilisateurService.findByRole(role));
    }

    @PostMapping("/creer")
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Map<String, Object> userData) {
        String email = (String) userData.get("email");
        if (utilisateurService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        String role = (String) userData.get("role");
        String nom = (String) userData.get("nom");
        String prenom = (String) userData.get("prenom");
        String motDePasse = (String) userData.get("motDePasse");

        Utilisateur utilisateur;

        switch (role) {
            case "ADMINISTRATEUR":
                utilisateur = new Administrateur();
                break;
            case "MEDECIN":
                utilisateur = new Medecin();
                if (userData.containsKey("specialite")) {
                    String specialiteStr = (String) userData.get("specialite");
                    ((Medecin) utilisateur).setSpecialite(SpecialiteEnum.valueOf(specialiteStr));
                }
                break;
            case "INFIRMIER":
                utilisateur = new Infirmier();
                break;
            case "TECHNICIEN":
                utilisateur = new Technicien();
                break;
            case "PATIENT":
                utilisateur = new Patient();
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        utilisateur.setEmail(email);
        utilisateur.setNom(nom);
        utilisateur.setPrenom(prenom);
        utilisateur.setMotDePasse(passwordEncoder.encode(motDePasse));
        utilisateur.setRole(RoleEnum.valueOf(role));

        Utilisateur savedUtilisateur = utilisateurService.save(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUtilisateur);
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        if (!utilisateurService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        utilisateur.setId(id);

        // Encrypt the password before saving
        String rawPassword = utilisateur.getMotDePasse();
        if (rawPassword != null && !rawPassword.isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(rawPassword));
        }

        return ResponseEntity.ok(utilisateurService.save(utilisateur));
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        if (!utilisateurService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        utilisateurService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
