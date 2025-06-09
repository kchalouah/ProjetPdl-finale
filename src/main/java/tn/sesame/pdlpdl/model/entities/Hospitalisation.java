package tn.sesame.pdlpdl.model.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

/**
 * Classe représentant une hospitalisation dans le système DMIC.
 * Une hospitalisation est liée à un patient, un service, un bloc et une chambre.
 */
@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospitalisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    private Date dateEntree;

    @Column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    private Date dateSortie;

    @Column(length = 2000)
    private String motif;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bloc_id", nullable = false)
    private Bloc bloc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chambre_id", nullable = false)
    private Chambre chambre;
}
