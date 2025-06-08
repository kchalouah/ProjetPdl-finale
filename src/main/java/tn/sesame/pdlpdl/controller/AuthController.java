package tn.sesame.pdlpdl.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.security.CustomUserDetailsService;
import tn.sesame.pdlpdl.service.impl.UtilisateurServiceImpl;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final UtilisateurServiceImpl utilisateurServiceImpl;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String motDePasse, HttpServletRequest request) {
        try {
            // Recherche de l'utilisateur par email
            Utilisateur utilisateur = utilisateurServiceImpl.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

            // Vérification du mot de passe
            if (!passwordEncoder.matches(motDePasse, utilisateur.getMotDePasse())) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Mot de passe incorrect"
                ));
            }

            // Création de l'objet Authentication
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                email, 
                null, // Mot de passe null car déjà vérifié
                userDetailsService.loadUserByUsername(email).getAuthorities()
            );

            // Mise à jour du contexte de sécurité
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Création de la session
            request.getSession(true);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "role", utilisateur.getRole().name()
            ));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Utilisateur non trouvé"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Erreur lors de l'authentification: " + e.getMessage()
            ));
        }
    }
}
