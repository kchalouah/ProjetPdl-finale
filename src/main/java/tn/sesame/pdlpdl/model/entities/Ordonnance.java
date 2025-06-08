package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * Classe représentant une ordonnance médicale dans le système DMIC.
 * Une ordonnance est émise lors d'une consultation par un médecin.
 */
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ordonnance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Date dateHeure;

    @Column(nullable = false, length = 2000)
    private String prescriptions;

    @Column
    private Integer dureeTraitement;

    @Column(length = 2000)
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;
}