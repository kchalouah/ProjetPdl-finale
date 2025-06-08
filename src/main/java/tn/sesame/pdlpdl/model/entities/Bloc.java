package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe représentant un bloc hospitalier dans le système DMIC.
 * Un bloc appartient à un service et contient plusieurs chambres.
 */
@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bloc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Service service;

    @OneToMany(mappedBy = "bloc", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<Chambre> chambres = new ArrayList<>();
}
