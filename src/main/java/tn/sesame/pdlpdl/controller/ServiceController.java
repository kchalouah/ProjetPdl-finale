package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Service;
import tn.sesame.pdlpdl.service.IServiceService;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des services hospitaliers.
 */
@RestController
@RequestMapping("/api/service")
public class ServiceController {

    private final IServiceService serviceService;

    @Autowired
    public ServiceController(IServiceService serviceService) {
        this.serviceService = serviceService;
    }

    /**
     * Récupère tous les services.
     */
    @GetMapping("/afficherservices")
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    /**
     * Récupère un service par son identifiant.
     */
    @GetMapping("/afficherservice/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupère un service par son nom.
     */
    @GetMapping("/afficherservicebynom/{nom}")
    public ResponseEntity<Service> getServiceByNom(@PathVariable String nom) {
        return serviceService.findByNom(nom)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crée un nouveau service.
     */
    @PostMapping("/ajouterservice")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        if (serviceService.existsByNom(service.getNom())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Service savedService = serviceService.save(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedService);
    }

    /**
     * Met à jour un service existant.
     */
    @PutMapping("/modifierservice/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service service) {
        if (!serviceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.setId(id);
        return ResponseEntity.ok(serviceService.save(service));
    }

    /**
     * Supprime un service.
     */
    @DeleteMapping("/supprimerservice/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (!serviceService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
