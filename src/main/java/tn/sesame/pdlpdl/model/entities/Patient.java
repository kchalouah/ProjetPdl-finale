package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

/**
 * Classe représentant un patient du système DMIC.
 * Un patient est lié à un dossier médical et peut avoir plusieurs hospitalisations.
 */
@Getter
@Setter
@Entity
@DiscriminatorValue("PATIENT")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Patient extends Utilisateur {

    @Column(nullable = false)
    private Date dateNaissance;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String telephone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dossier_medical_id", unique = true)
    private DossierMedical dossierMedical;

    // Les hospitalisations sont gérées par la classe Hospitalisation avec une relation ManyToOne vers Patient
}
