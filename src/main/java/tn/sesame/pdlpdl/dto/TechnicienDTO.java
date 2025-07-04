package tn.sesame.pdlpdl.dto;

import tn.sesame.pdlpdl.model.enums.RoleEnum;

public class TechnicienDTO {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private RoleEnum role;
    private Long serviceId;
    private Long blocId;

    // Constructors
    public TechnicienDTO() {}

    public TechnicienDTO(String nom, String prenom, String email, String motDePasse, RoleEnum role, Long serviceId, Long blocId) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.serviceId = serviceId;
        this.blocId = blocId;
    }

    // Getters and Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public RoleEnum getRole() {
        return role;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getBlocId() {
        return blocId;
    }

    public void setBlocId(Long blocId) {
        this.blocId = blocId;
    }
}
