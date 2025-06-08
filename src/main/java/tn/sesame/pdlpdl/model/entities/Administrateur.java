package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@DiscriminatorValue("ADMINISTRATEUR")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class Administrateur extends Utilisateur {
    // Pas d'attributs spécifiques supplémentaires pour l'administrateur
}
