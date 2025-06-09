package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Service;
import tn.sesame.pdlpdl.service.IBlocService;
import tn.sesame.pdlpdl.service.IServiceService;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des blocs hospitaliers.
 */
@RestController
@RequestMapping("/api/bloc") // Chemin simplifié et clair
public class BlocController {

    private final IBlocService blocService;
    private final IServiceService serviceService;

    @Autowired
    public BlocController(IBlocService blocService, IServiceService serviceService) {
        this.blocService = blocService;
        this.serviceService = serviceService;
    }

    // GET: Afficher tous les blocs
    @GetMapping("/afficherblocs")
    public ResponseEntity<List<Bloc>> getAllBlocs() {
        return ResponseEntity.ok(blocService.findAll());
    }

    // GET: Afficher un bloc par ID
    @GetMapping("/afficherbloc/{id}")
    public ResponseEntity<Bloc> getBlocById(@PathVariable Long id) {
        return blocService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Afficher un bloc par numéro
    @GetMapping("/afficherblocbynumero/{numero}")
    public ResponseEntity<Bloc> getBlocByNumero(@PathVariable String numero) {
        return blocService.findByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Afficher tous les blocs d'un service
    @GetMapping("/afficherblocsparservice/{serviceId}")
    public ResponseEntity<List<Bloc>> getBlocsByService(@PathVariable Long serviceId) {
        return serviceService.findById(serviceId)
                .map(service -> ResponseEntity.ok(blocService.findByService(service)))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Ajouter un bloc
    @PostMapping("/ajouterbloc")
    public ResponseEntity<?> createBloc(@RequestBody Bloc bloc, @RequestParam Long serviceId) {
        if (bloc.getNumero() == null || bloc.getNumero().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Le champ 'numero' du bloc est requis.");
        }
        return serviceService.findById(serviceId)
                .map(service -> {
                    if (blocService.existsByNumeroAndService(bloc.getNumero(), service)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body("Un bloc avec ce numéro existe déjà pour ce service.");
                    }
                    bloc.setService(service);
                    Bloc savedBloc = blocService.save(bloc);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedBloc);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service non trouvé."));
    }

    // PUT: Modifier un bloc
    @PutMapping("/modifierbloc/{id}")
    public ResponseEntity<Bloc> updateBloc(@PathVariable Long id, @RequestBody Bloc bloc, @RequestParam(required = false) Long serviceId) {
        if (!blocService.existsById(id)) {
            return ResponseEntity.notFound().<Bloc>build();
        }

        bloc.setId(id);

        if (serviceId != null) {
            return serviceService.findById(serviceId)
                    .map(service -> {
                        bloc.setService(service);
                        return ResponseEntity.ok(blocService.save(bloc));
                    })
                    .orElse(ResponseEntity.notFound().<Bloc>build());
        } else {
            return blocService.findById(id)
                    .map(existingBloc -> {
                        bloc.setService(existingBloc.getService());
                        return ResponseEntity.ok(blocService.save(bloc));
                    })
                    .orElse(ResponseEntity.notFound().<Bloc>build());
        }
    }

    // DELETE: Supprimer un bloc
    @DeleteMapping("/supprimerbloc/{id}")
    public ResponseEntity<Void> deleteBloc(@PathVariable Long id) {
        if (!blocService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        blocService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}