package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.model.enums.RoleEnum;
import tn.sesame.pdlpdl.repository.UtilisateurRepository;
import tn.sesame.pdlpdl.service.IUtilisateurService;

import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des utilisateurs.
 */
@Service
public class UtilisateurServiceImpl implements IUtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public Utilisateur save(Utilisateur entity) {
        return utilisateurRepository.save(entity);
    }

    @Override
    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    @Override
    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return utilisateurRepository.existsById(id);
    }

    @Override
    public Optional<Utilisateur> findByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    @Override
    public List<Utilisateur> findByRole(RoleEnum role) {
        return utilisateurRepository.findByRole(role);
    }

    @Override
    public boolean existsByEmail(String email) {
        return utilisateurRepository.existsByEmail(email);
    }
}