package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;
import tn.sesame.pdlpdl.model.enums.JourEnum;

import java.time.LocalTime;

/**
 * Classe représentant un planning de travail pour le personnel soignant dans le système DMIC.
 * Un planning définit les horaires de travail pour un jour spécifique.
 */
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Planning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JourEnum jour;

    @Column(nullable = false)
    private LocalTime heureDebut;

    @Column(nullable = false)
    private LocalTime heureFin;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;
}