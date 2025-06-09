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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des utilisateurs.
 */
@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:3000")
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
        try {
            return ResponseEntity.ok(utilisateurService.findAll());
        } catch (Exception e) {
            System.err.println("Error fetching all users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/par-id/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        try {
            return utilisateurService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error fetching user by id: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/par-email/{email}")
    public ResponseEntity<Utilisateur> getUtilisateurByEmail(@PathVariable String email) {
        try {
            return utilisateurService.findByEmail(email)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error fetching user by email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/par-role/{role}")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByRole(@PathVariable RoleEnum role) {
        try {
            return ResponseEntity.ok(utilisateurService.findByRole(role));
        } catch (Exception e) {
            System.err.println("Error fetching users by role: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/creer")
    public ResponseEntity<?> createUtilisateur(@RequestBody Map<String, Object> userData) {
        try {
            System.out.println("Received user data: " + userData);

            // Validate required fields
            String email = (String) userData.get("email");
            String role = (String) userData.get("role");
            String nom = (String) userData.get("nom");
            String prenom = (String) userData.get("prenom");
            String motDePasse = (String) userData.get("motDePasse");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (role == null || role.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Role is required");
            }
            if (nom == null || nom.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nom is required");
            }
            if (prenom == null || prenom.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Prenom is required");
            }
            if (motDePasse == null || motDePasse.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            if (utilisateurService.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }

            Utilisateur utilisateur;

            switch (role.toUpperCase()) {
                case "ADMINISTRATEUR":
                    utilisateur = new Administrateur();
                    break;
                case "MEDECIN":
                    utilisateur = new Medecin();
                    if (userData.containsKey("specialite") && userData.get("specialite") != null) {
                        String specialiteStr = (String) userData.get("specialite");
                        try {
                            ((Medecin) utilisateur).setSpecialite(SpecialiteEnum.valueOf(specialiteStr.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.badRequest().body("Invalid specialite: " + specialiteStr);
                        }
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

                    // Handle patient-specific fields with proper validation
                    if (userData.containsKey("dateNaissance") && userData.get("dateNaissance") != null) {
                        String dateNaissanceStr = (String) userData.get("dateNaissance");
                        System.out.println("Date de naissance received: " + dateNaissanceStr);

                        try {
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            sdf.setLenient(false); // Strict date parsing
                            Date dateNaissance = sdf.parse(dateNaissanceStr);
                            ((Patient) utilisateur).setDateNaissance(dateNaissance);
                            System.out.println("Date parsed successfully: " + dateNaissance);
                        } catch (ParseException e) {
                            System.err.println("Date parsing error: " + e.getMessage());
                            e.printStackTrace();
                            return ResponseEntity.badRequest().body("Invalid date format for dateNaissance. Expected: yyyy-MM-dd, received: " + dateNaissanceStr);
                        }
                    } else {
                        return ResponseEntity.badRequest().body("Date de naissance is required for patients");
                    }

                    if (userData.containsKey("adresse") && userData.get("adresse") != null) {
                        String adresse = (String) userData.get("adresse");
                        if (adresse.trim().isEmpty()) {
                            return ResponseEntity.badRequest().body("Adresse cannot be empty for patients");
                        }
                        ((Patient) utilisateur).setAdresse(adresse);
                    } else {
                        return ResponseEntity.badRequest().body("Adresse is required for patients");
                    }

                    if (userData.containsKey("telephone") && userData.get("telephone") != null) {
                        String telephone = (String) userData.get("telephone");
                        if (telephone.trim().isEmpty()) {
                            return ResponseEntity.badRequest().body("Telephone cannot be empty for patients");
                        }
                        ((Patient) utilisateur).setTelephone(telephone);
                    } else {
                        return ResponseEntity.badRequest().body("Telephone is required for patients");
                    }
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid role: " + role);
            }

            // Set common fields
            utilisateur.setEmail(email.trim());
            utilisateur.setNom(nom.trim());
            utilisateur.setPrenom(prenom.trim());
            // Always hash password unless already a valid BCrypt hash
            if (motDePasse != null && !motDePasse.trim().isEmpty()) {
                if (!(motDePasse.startsWith("$2a$") || motDePasse.startsWith("$2b$") || motDePasse.startsWith("$2y$"))) {
                    utilisateur.setMotDePasse(passwordEncoder.encode(motDePasse));
                } else {
                    utilisateur.setMotDePasse(motDePasse);
                }
            }
            utilisateur.setRole(RoleEnum.valueOf(role.toUpperCase()));

            System.out.println("Creating user: " + utilisateur.getClass().getSimpleName() + " with email: " + email);

            Utilisateur savedUtilisateur = utilisateurService.save(utilisateur);
            System.out.println("User created successfully with ID: " + savedUtilisateur.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUtilisateur);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid argument: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error: " + e.getMessage());
        }
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        try {
            System.out.println("Updating user with ID: " + id + ", data: " + userData);

            Optional<Utilisateur> existingUserOpt = utilisateurService.findById(id);
            if (!existingUserOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Utilisateur existingUser = existingUserOpt.get();

            // Update basic fields
            if (userData.containsKey("nom") && userData.get("nom") != null) {
                existingUser.setNom((String) userData.get("nom"));
            }
            if (userData.containsKey("prenom") && userData.get("prenom") != null) {
                existingUser.setPrenom((String) userData.get("prenom"));
            }
            if (userData.containsKey("email") && userData.get("email") != null) {
                String newEmail = (String) userData.get("email");
                if (!newEmail.equals(existingUser.getEmail()) && utilisateurService.existsByEmail(newEmail)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
                }
                existingUser.setEmail(newEmail);
            }

            // Handle password update
            if (userData.containsKey("motDePasse") && userData.get("motDePasse") != null) {
                String rawPassword = (String) userData.get("motDePasse");
                if (!rawPassword.trim().isEmpty()) {
                    if (!(rawPassword.startsWith("$2a$") || rawPassword.startsWith("$2b$") || rawPassword.startsWith("$2y$"))) {
                        existingUser.setMotDePasse(passwordEncoder.encode(rawPassword));
                    } else {
                        existingUser.setMotDePasse(rawPassword);
                    }
                }
            }

            // Handle role-specific fields
            if (existingUser instanceof Patient) {
                Patient patient = (Patient) existingUser;

                if (userData.containsKey("dateNaissance") && userData.get("dateNaissance") != null) {
                    String dateNaissanceStr = (String) userData.get("dateNaissance");
                    try {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        sdf.setLenient(false); // Strict date parsing
                        Date dateNaissance = sdf.parse(dateNaissanceStr);
                        patient.setDateNaissance(dateNaissance);
                    } catch (ParseException e) {
                        return ResponseEntity.badRequest().body("Invalid date format for dateNaissance. Expected: yyyy-MM-dd");
                    }
                }

                if (userData.containsKey("adresse") && userData.get("adresse") != null) {
                    patient.setAdresse((String) userData.get("adresse"));
                }

                if (userData.containsKey("telephone") && userData.get("telephone") != null) {
                    patient.setTelephone((String) userData.get("telephone"));
                }
            } else if (existingUser instanceof Medecin) {
                Medecin medecin = (Medecin) existingUser;

                if (userData.containsKey("specialite") && userData.get("specialite") != null) {
                    String specialiteStr = (String) userData.get("specialite");
                    try {
                        medecin.setSpecialite(SpecialiteEnum.valueOf(specialiteStr.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body("Invalid specialite: " + specialiteStr);
                    }
                }
            }

            Utilisateur updatedUser = utilisateurService.save(existingUser);
            System.out.println("User updated successfully");

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable Long id) {
        try {
            if (!utilisateurService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            utilisateurService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error: " + e.getMessage());
        }
    }
}