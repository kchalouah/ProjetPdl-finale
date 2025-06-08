package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import tn.sesame.pdlpdl.model.enums.ResultatMaintenance;
import tn.sesame.pdlpdl.model.enums.TypeMaintenance;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_intervention", nullable = false)
    private LocalDate dateIntervention;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeMaintenance type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultatMaintenance resultat = ResultatMaintenance.EN_COURS;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "duree_intervention")
    private Integer dureeIntervention; // en minutes

    @Column(name = "cout_intervention")
    private Double coutIntervention;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipement_id", nullable = false)
    private Equipement equipement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technicien_id", nullable = false)
    private Utilisateur technicien;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}