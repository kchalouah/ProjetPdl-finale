package tn.sesame.pdlpdl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.sesame.pdlpdl.model.entities.Utilisateur;
import tn.sesame.pdlpdl.model.enums.RoleEnum;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);         // ✅ déjà utilisée

    List<Utilisateur> findByRole(RoleEnum role);             // ✅ pour findByRole()

    boolean existsByEmail(String email);                     // ✅ pour existsByEmail()
}
