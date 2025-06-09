package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * Classe représentant un diagnostic médical dans le système DMIC.
 * Un diagnostic est établi lors d'une consultation par un médecin.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Diagnostic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(length = 2000)
    private String recommandations;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateHeure;

    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;
}