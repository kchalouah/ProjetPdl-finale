package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Classe représentant une chambre hospitalière dans le système DMIC.
 * Une chambre appartient à un bloc.
 */
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chambre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private Integer capacite;

    @ManyToOne
    @JoinColumn(name = "bloc_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Bloc bloc;
}
