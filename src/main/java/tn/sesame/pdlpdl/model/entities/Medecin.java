package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.SuperBuilder;
import tn.sesame.pdlpdl.model.enums.SpecialiteEnum;

/**
 * Classe représentant un médecin du système DMIC.
 * Le médecin est caractérisé par sa spécialité médicale et est l'acteur central
 * dans la prise en charge des patients.
 */
@Getter
@Setter
@Entity
@DiscriminatorValue("MEDECIN")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Medecin extends Utilisateur {
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpecialiteEnum specialite;
}