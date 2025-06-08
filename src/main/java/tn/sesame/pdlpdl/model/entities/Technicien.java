package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Classe représentant un technicien du système DMIC.
 * Un technicien est affecté à un service et à un bloc.
 */
@Getter
@Setter
@Entity
@DiscriminatorValue("TECHNICIEN")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Technicien extends Utilisateur {
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;
    
    @ManyToOne
    @JoinColumn(name = "bloc_id")
    private Bloc bloc;
}