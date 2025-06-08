package tn.sesame.pdlpdl.service;

import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.model.enums.RoleEnum;

import java.util.List;
import java.util.Optional;

/**
 * Interface pour le service de gestion des utilisateurs.
 */
public interface IUtilisateurService extends IService<Utilisateur, Long> {
    
    /**
     * Recherche un utilisateur par son email.
     * @param email l'email de l'utilisateur
     * @return un Optional contenant l'utilisateur s'il existe
     */
    Optional<Utilisateur> findByEmail(String email);
    
    /**
     * Recherche tous les utilisateurs ayant un rôle spécifique.
     * @param role le rôle recherché
     * @return la liste des utilisateurs ayant ce rôle
     */
    List<Utilisateur> findByRole(RoleEnum role);
    
    /**
     * Vérifie si un email est déjà utilisé.
     * @param email l'email à vérifier
     * @return true si l'email existe déjà, false sinon
     */
    boolean existsByEmail(String email);
}