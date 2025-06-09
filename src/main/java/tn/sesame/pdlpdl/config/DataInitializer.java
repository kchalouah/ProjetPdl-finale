package tn.sesame.pdlpdl.config;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import tn.sesame.pdlpdl.model.entities.*;
import tn.sesame.pdlpdl.model.enums.*;
import tn.sesame.pdlpdl.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * Classe de configuration pour initialiser des données de test dans l'application.
 * Cette classe crée des utilisateurs, des services, des blocs, des chambres, des équipements,
 * des patients, des dossiers médicaux, des consultations, etc.
 */
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;
    private final ServiceRepository serviceRepository;
    private final BlocRepository blocRepository;
    private final ChambreRepository chambreRepository;
    private final EquipementRepository equipementRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final ConsultationRepository consultationRepository;
    private final DiagnosticRepository diagnosticRepository;
    private final OrdonnanceRepository ordonnanceRepository;
    private final MaintenanceRepository maintenanceRepository;

    @Bean
    @Transactional
    public CommandLineRunner initData() {
        return args -> {
            // Vérifier si des données existent déjà
            if (utilisateurRepository.count() > 0) {
                System.out.println("La base de données contient déjà des données, initialisation ignorée.");
                return;
            }

            System.out.println("Initialisation des données de test...");

            // Création des administrateurs
            Administrateur admin = Administrateur.builder()
                    .nom("Admin")
                    .prenom("System")
                    .email("admin@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.ADMINISTRATEUR)
                    .build();
            utilisateurRepository.save(admin);

            // Création des services
            Service serviceCardiologie = Service.builder()
                    .nom("Cardiologie")
                    .build();
            serviceRepository.save(serviceCardiologie);

            Service servicePediatrie = Service.builder()
                    .nom("Pédiatrie")
                    .build();
            serviceRepository.save(servicePediatrie);

            // Création des blocs
            Bloc blocA = Bloc.builder()
                    .numero("A")
                    .service(serviceCardiologie)
                    .build();
            blocRepository.save(blocA);

            Bloc blocB = Bloc.builder()
                    .numero("B")
                    .service(servicePediatrie)
                    .build();
            blocRepository.save(blocB);

            // Création des chambres
            Chambre chambre101 = Chambre.builder()
                    .numero("101")
                    .capacite(2)
                    .bloc(blocA)
                    .build();
            chambreRepository.save(chambre101);

            Chambre chambre102 = Chambre.builder()
                    .numero("102")
                    .capacite(1)
                    .bloc(blocA)
                    .build();
            chambreRepository.save(chambre102);

            Chambre chambre201 = Chambre.builder()
                    .numero("201")
                    .capacite(2)
                    .bloc(blocB)
                    .build();
            chambreRepository.save(chambre201);

            // Création des médecins
            Medecin medecinCardiologue = Medecin.builder()
                    .nom("Dupont")
                    .prenom("Jean")
                    .email("jean.dupont@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.MEDECIN)
                    .specialite(SpecialiteEnum.CARDIOLOGIE)
                    .build();
            utilisateurRepository.save(medecinCardiologue);

            Medecin medecinPediatre = Medecin.builder()
                    .nom("Martin")
                    .prenom("Sophie")
                    .email("sophie.martin@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.MEDECIN)
                    .specialite(SpecialiteEnum.PEDIATRIE)
                    .build();
            utilisateurRepository.save(medecinPediatre);

            // Création des infirmiers
            Infirmier infirmier1 = Infirmier.builder()
                    .nom("Petit")
                    .prenom("Marie")
                    .email("marie.petit@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.INFIRMIER)
                    .service(serviceCardiologie)
                    .build();
            utilisateurRepository.save(infirmier1);

            Infirmier infirmier2 = Infirmier.builder()
                    .nom("Dubois")
                    .prenom("Pierre")
                    .email("pierre.dubois@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.INFIRMIER)
                    .service(servicePediatrie)
                    .build();
            utilisateurRepository.save(infirmier2);

            // Création des techniciens
            Technicien technicien = Technicien.builder()
                    .nom("Leroy")
                    .prenom("Thomas")
                    .email("thomas.leroy@dmic.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.TECHNICIEN)
                    .service(serviceCardiologie)
                    .bloc(blocA)
                    .build();
            utilisateurRepository.save(technicien);

            // Création des équipements
            Equipement equipement1 = new Equipement();
            equipement1.setNom("Moniteur cardiaque");
            equipement1.setType("Moniteur");
            equipement1.setModele("CardioMonitor 3000");
            equipement1.setNumeroSerie("CM3000-001");
            equipement1.setLocalisation("Chambre 101");
            equipement1.setDateInstallation(LocalDate.now());
            equipement1.setEtat(EtatEquipement.FONCTIONNEL);
            equipement1.setNotes("Moniteur pour surveiller le rythme cardiaque");
            equipementRepository.save(equipement1);

            Equipement equipement2 = new Equipement();
            equipement2.setNom("Échographe");
            equipement2.setType("Imagerie");
            equipement2.setModele("EchoScan 2000");
            equipement2.setNumeroSerie("ES2000-001");
            equipement2.setLocalisation("Chambre 201");
            equipement2.setDateInstallation(LocalDate.now());
            equipement2.setEtat(EtatEquipement.FONCTIONNEL);
            equipement2.setNotes("Appareil d'échographie");
            equipementRepository.save(equipement2);

            // Création des maintenances
            Maintenance maintenance = new Maintenance();
            maintenance.setDateIntervention(LocalDate.now());
            maintenance.setType(TypeMaintenance.PREVENTIVE);
            maintenance.setDescription("Maintenance préventive");
            maintenance.setResultat(ResultatMaintenance.EN_COURS);
            maintenance.setObservations("RAS");
            maintenance.setDureeIntervention(60);
            maintenance.setCoutIntervention(100.0);
            maintenance.setEquipement(equipement1);
            maintenance.setTechnicien(technicien);
            maintenanceRepository.save(maintenance);

            // Création des patients et dossiers médicaux
            DossierMedical dossier1 = DossierMedical.builder()
                    .dateCreation(new Date())
                    .antecedentsMedicaux("Hypertension, diabète de type 2")
                    .resultatsBiologiques("Glycémie: 1.2g/L, Cholestérol: 2.1g/L")
                    .resultatsRadiologiques("Radiographie thoracique normale")
                    .build();
            dossierMedicalRepository.save(dossier1);

            Patient patient1 = Patient.builder()
                    .nom("Durand")
                    .prenom("Robert")
                    .email("robert.durand@email.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.PATIENT)
                    .dateNaissance(new Date(70, 5, 15)) // 15/06/1970
                    .adresse("123 Rue de Paris, 75001 Paris")
                    .telephone("0123456789")
                    .dossierMedical(dossier1)
                    .build();
            utilisateurRepository.save(patient1);
            dossier1.setPatient(patient1);
            dossierMedicalRepository.save(dossier1);

            DossierMedical dossier2 = DossierMedical.builder()
                    .dateCreation(new Date())
                    .antecedentsMedicaux("Asthme")
                    .resultatsBiologiques("Bilan sanguin normal")
                    .resultatsRadiologiques("Scanner pulmonaire: légère inflammation")
                    .build();
            dossierMedicalRepository.save(dossier2);

            Patient patient2 = Patient.builder()
                    .nom("Moreau")
                    .prenom("Julie")
                    .email("julie.moreau@email.com")
                    .motDePasse(passwordEncoder.encode("password"))
                    .role(RoleEnum.PATIENT)
                    .dateNaissance(new Date(85, 9, 22)) // 22/10/1985
                    .adresse("456 Avenue Victor Hugo, 69002 Lyon")
                    .telephone("0987654321")
                    .dossierMedical(dossier2)
                    .build();
            utilisateurRepository.save(patient2);
            dossier2.setPatient(patient2);
            dossierMedicalRepository.save(dossier2);

            // Création des consultations
            Consultation consultation1 = Consultation.builder()
                    .dateHeure(new Date())
                    .notes("Patient se plaint de douleurs thoraciques")
                    .actesRealises("ECG, prise de tension")
                    .medecin(medecinCardiologue)
                    .dossierMedical(dossier1)
                    .build();
            consultationRepository.save(consultation1);

            Consultation consultation2 = Consultation.builder()
                    .dateHeure(new Date(System.currentTimeMillis() - 604800000)) // -1 semaine
                    .notes("Suivi d'asthme")
                    .actesRealises("Auscultation, test de fonction respiratoire")
                    .medecin(medecinPediatre)
                    .dossierMedical(dossier2)
                    .build();
            consultationRepository.save(consultation2);

            // Création des diagnostics
            Diagnostic diagnostic1 = Diagnostic.builder()
                    .description("Suspicion d'angine de poitrine")
                    .dateHeure(new Date())
                    .recommandations("Repos, éviter les efforts physiques")
                    .consultation(consultation1)
                    .build();
            diagnosticRepository.save(diagnostic1);

            Diagnostic diagnostic2 = Diagnostic.builder()
                    .description("Asthme bien contrôlé")
                    .dateHeure(new Date(System.currentTimeMillis() - 604800000)) // -1 semaine
                    .recommandations("Continuer le traitement actuel")
                    .consultation(consultation2)
                    .build();
            diagnosticRepository.save(diagnostic2);

            // Création des ordonnances
            Ordonnance ordonnance1 = Ordonnance.builder()
                    .datePrescription(new Date())
                    .medicaments("Aspirine 100mg 1cp/jour\nBêta-bloquant 5mg 1cp matin et soir")
                    .instructions("Prendre après les repas")
                    .consultation(consultation1)
                    .build();
            ordonnanceRepository.save(ordonnance1);

            Ordonnance ordonnance2 = Ordonnance.builder()
                    .datePrescription(new Date(System.currentTimeMillis() - 604800000)) // -1 semaine
                    .medicaments("Ventoline 2 bouffées en cas de crise\nCorticoïde inhalé 2 bouffées matin et soir")
                    .instructions("Rincer la bouche après utilisation du corticoïde")
                    .consultation(consultation2)
                    .build();
            ordonnanceRepository.save(ordonnance2);

            System.out.println("Initialisation des données de test terminée avec succès.");
        };
    }
}