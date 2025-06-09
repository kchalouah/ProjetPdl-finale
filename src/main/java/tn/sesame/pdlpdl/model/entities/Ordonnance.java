package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date datePrescription;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_heure", nullable = false)
    private Date dateHeure;

    @Column(nullable = false, length = 2000)
    private String medicaments;

    @Column(length = 2000)
    private String instructions;

    @Column(nullable = false, length = 2000)
    private String prescriptions;

    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;
}