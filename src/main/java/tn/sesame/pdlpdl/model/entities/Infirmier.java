package tn.sesame.pdlpdl.model.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Classe représentant un infirmier du système DMIC.
 * Un infirmier est affecté à un service et à un bloc.
 */
@Getter
@Setter
@Entity
@DiscriminatorValue("INFIRMIER")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Infirmier extends Utilisateur {
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;
    
    @ManyToOne
    @JoinColumn(name = "bloc_id")
    private Bloc bloc;
}