package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * Classe représentant une consultation médicale dans le système DMIC.
 * Une consultation est créée par un médecin et est liée à un dossier médical.
 * Elle peut contenir des diagnostics et des ordonnances.
 */
@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date dateHeure;

    @Column(length = 2000)
    private String notes;

    @Column(length = 2000)
    private String actesRealises;

    @ManyToOne
    @JoinColumn(name = "medecin_id", nullable = false)
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "dossier_medical_id", nullable = false)
    private DossierMedical dossierMedical;

    // Les diagnostics sont gérés par la classe Diagnostic avec une relation ManyToOne vers Consultation

    // Les ordonnances sont gérées par la classe Ordonnance avec une relation ManyToOne vers Consultation
}
