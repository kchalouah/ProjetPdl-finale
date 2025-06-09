package tn.sesame.pdlpdl.model.entities;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.sesame.pdlpdl.model.enums.RoleEnum;

/**
 * Classe abstraite représentant un utilisateur du système DMIC.
 * Cette classe sert de base pour tous les types d'utilisateurs.
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Medecin.class, name = "medecin"),
        @JsonSubTypes.Type(value = Patient.class, name = "patient"),
        @JsonSubTypes.Type(value = Administrateur.class, name = "administrateur"),
        @JsonSubTypes.Type(value = Infirmier.class, name = "infirmier"),
        @JsonSubTypes.Type(value = Technicien.class, name = "technicien")
})
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type_utilisateur")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleEnum role;
}
