package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.*;
import tn.sesame.pdlpdl.service.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitalisation")
public class HospitalisationController {

    private final IHospitalisationService hospitalisationService;
    private final IPatientService patientService;
    private final IServiceService serviceService;
    private final IBlocService blocService;
    private final IChambreService chambreService;

    @Autowired
    public HospitalisationController(IHospitalisationService hospitalisationService,
                                     IPatientService patientService,
                                     IServiceService serviceService,
                                     IBlocService blocService,
                                     IChambreService chambreService) {
        this.hospitalisationService = hospitalisationService;
        this.patientService = patientService;
        this.serviceService = serviceService;
        this.blocService = blocService;
        this.chambreService = chambreService;
    }

    @GetMapping("/afficherhospitalisations")
    public ResponseEntity<List<Hospitalisation>> getAll() {
        return ResponseEntity.ok(hospitalisationService.findAll());
    }

    @GetMapping("/afficherhospitalisation/{id}")
    public ResponseEntity<Hospitalisation> getById(@PathVariable Long id) {
        return hospitalisationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterhospitalisation")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> requestData) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            // Parse dates
            Date dateEntree = sdf.parse((String) requestData.get("dateEntree"));
            Date dateSortie = null;
            if (requestData.get("dateSortie") != null && !((String) requestData.get("dateSortie")).isEmpty()) {
                dateSortie = sdf.parse((String) requestData.get("dateSortie"));
            }

            String motif = (String) requestData.get("motif");

            // Get related entities
            Map<String, Object> patientData = (Map<String, Object>) requestData.get("patient");
            Map<String, Object> serviceData = (Map<String, Object>) requestData.get("service");
            Map<String, Object> blocData = (Map<String, Object>) requestData.get("bloc");
            Map<String, Object> chambreData = (Map<String, Object>) requestData.get("chambre");

            Long patientId = Long.valueOf(patientData.get("id").toString());
            Long serviceId = Long.valueOf(serviceData.get("id").toString());
            Long blocId = Long.valueOf(blocData.get("id").toString());
            Long chambreId = Long.valueOf(chambreData.get("id").toString());

            // Fetch entities
            Patient patient = patientService.findById(patientId).orElse(null);
            Service service = serviceService.findById(serviceId).orElse(null);
            Bloc bloc = blocService.findById(blocId).orElse(null);
            Chambre chambre = chambreService.findById(chambreId).orElse(null);

            if (patient == null || service == null || bloc == null || chambre == null) {
                return ResponseEntity.badRequest().body("Une ou plusieurs entités liées sont introuvables");
            }

            // Create hospitalisation
            Hospitalisation hospitalisation = Hospitalisation.builder()
                    .dateEntree(dateEntree)
                    .dateSortie(dateSortie)
                    .motif(motif)
                    .patient(patient)
                    .service(service)
                    .bloc(bloc)
                    .chambre(chambre)
                    .build();

            Hospitalisation saved = hospitalisationService.save(hospitalisation);
            return ResponseEntity.ok(saved);

        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Format de date invalide");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/modifierhospitalisation/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        if (!hospitalisationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            // Parse dates
            Date dateEntree = sdf.parse((String) requestData.get("dateEntree"));
            Date dateSortie = null;
            if (requestData.get("dateSortie") != null && !((String) requestData.get("dateSortie")).isEmpty()) {
                dateSortie = sdf.parse((String) requestData.get("dateSortie"));
            }

            String motif = (String) requestData.get("motif");

            // Get related entities
            Map<String, Object> patientData = (Map<String, Object>) requestData.get("patient");
            Map<String, Object> serviceData = (Map<String, Object>) requestData.get("service");
            Map<String, Object> blocData = (Map<String, Object>) requestData.get("bloc");
            Map<String, Object> chambreData = (Map<String, Object>) requestData.get("chambre");

            Long patientId = Long.valueOf(patientData.get("id").toString());
            Long serviceId = Long.valueOf(serviceData.get("id").toString());
            Long blocId = Long.valueOf(blocData.get("id").toString());
            Long chambreId = Long.valueOf(chambreData.get("id").toString());

            // Fetch entities
            Patient patient = patientService.findById(patientId).orElse(null);
            Service service = serviceService.findById(serviceId).orElse(null);
            Bloc bloc = blocService.findById(blocId).orElse(null);
            Chambre chambre = chambreService.findById(chambreId).orElse(null);

            if (patient == null || service == null || bloc == null || chambre == null) {
                return ResponseEntity.badRequest().body("Une ou plusieurs entités liées sont introuvables");
            }

            // Update hospitalisation
            Hospitalisation hospitalisation = Hospitalisation.builder()
                    .id(id)
                    .dateEntree(dateEntree)
                    .dateSortie(dateSortie)
                    .motif(motif)
                    .patient(patient)
                    .service(service)
                    .bloc(bloc)
                    .chambre(chambre)
                    .build();

            Hospitalisation updated = hospitalisationService.save(hospitalisation);
            return ResponseEntity.ok(updated);

        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Format de date invalide");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la modification: " + e.getMessage());
        }
    }

    @DeleteMapping("/supprimerhospitalisation/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!hospitalisationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hospitalisationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // All API routes are correct and match the frontend usage
}