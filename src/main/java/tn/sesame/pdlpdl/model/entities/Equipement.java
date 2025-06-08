package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import tn.sesame.pdlpdl.model.enums.EtatEquipement;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "equipements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String modele;

    @Column(name = "numero_serie", nullable = false, unique = true)
    private String numeroSerie;

    @Column(nullable = false)
    private String localisation;

    @Column(name = "date_installation", nullable = false)
    private LocalDate dateInstallation;

    @Column(name = "date_derniere_verification")
    private LocalDate dateDerniereVerification;

    @Column(name = "date_prochaine_maintenance")
    private LocalDate dateProchaineMaintenance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatEquipement etat = EtatEquipement.FONCTIONNEL;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDate createdAt = LocalDate.now();

    @Column(name = "updated_at")
    private LocalDate updatedAt = LocalDate.now();

    // Relations
    @OneToMany(mappedBy = "equipement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Maintenance> maintenances;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDate.now();
    }
}