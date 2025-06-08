package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * Classe représentant un dossier médical dans le système DMIC.
 * Chaque patient possède un unique dossier médical contenant ses données personnelles,
 * ses antécédents médicaux et ses consultations.
 */
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date dateCreation;

    @Column(length = 2000)
    private String antecedentsMedicaux;

    @Column(length = 2000)
    private String resultatsBiologiques;

    @Column(length = 2000)
    private String resultatsRadiologiques;

    @OneToOne(mappedBy = "dossierMedical")
    private Patient patient;

    // Les consultations sont gérées par la classe Consultation avec une relation ManyToOne vers DossierMedical
}
