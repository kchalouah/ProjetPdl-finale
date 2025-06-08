package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Bloc;
import tn.sesame.pdlpdl.model.entities.Chambre;
import tn.sesame.pdlpdl.service.IBlocService;
import tn.sesame.pdlpdl.service.IChambreService;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des chambres hospitalières.
 */
@RestController
@RequestMapping("/api/chambre")
public class ChambreController {

    private final IChambreService chambreService;
    private final IBlocService blocService;

    @Autowired
    public ChambreController(IChambreService chambreService, IBlocService blocService) {
        this.chambreService = chambreService;
        this.blocService = blocService;
    }

    @GetMapping("/afficherchambres")
    public ResponseEntity<List<Chambre>> getAllChambres() {
        return ResponseEntity.ok(chambreService.findAll());
    }

    @GetMapping("/afficherchambre/{id}")
    public ResponseEntity<Chambre> getChambreById(@PathVariable Long id) {
        return chambreService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().<Chambre>build());
    }

    @GetMapping("/afficherchambreparnumero/{numero}")
    public ResponseEntity<Chambre> getChambreByNumero(@PathVariable String numero) {
        return chambreService.findByNumero(numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().<Chambre>build());
    }

    @GetMapping("/afficherchambresparbloc/{blocId}")
    public ResponseEntity<List<Chambre>> getChambresByBloc(@PathVariable Long blocId) {
        return blocService.findById(blocId)
                .map(bloc -> ResponseEntity.ok(chambreService.findByBloc(bloc)))
                .orElse(ResponseEntity.notFound().<List<Chambre>>build());
    }

    @GetMapping("/afficherchambresparcapacitemin/{capacite}")
    public ResponseEntity<List<Chambre>> getChambresByCapaciteMin(@PathVariable Integer capacite) {
        return ResponseEntity.ok(chambreService.findByCapaciteGreaterThanEqual(capacite));
    }

    @PostMapping("/ajouterchambre")
    public ResponseEntity<Chambre> createChambre(@RequestBody Chambre chambre, @RequestParam Long blocId) {
        return blocService.findById(blocId)
                .map(bloc -> {
                    if (chambreService.existsByNumeroAndBloc(chambre.getNumero(), bloc)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).<Chambre>build();
                    }
                    chambre.setBloc(bloc);
                    Chambre savedChambre = chambreService.save(chambre);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedChambre);
                })
                .orElse(ResponseEntity.notFound().<Chambre>build());
    }

    @PutMapping("/modifierchambre/{id}")
    public ResponseEntity<Chambre> updateChambre(@PathVariable Long id, @RequestBody Chambre chambre, @RequestParam(required = false) Long blocId) {
        if (!chambreService.existsById(id)) {
            return ResponseEntity.notFound().<Chambre>build();
        }

        chambre.setId(id);

        if (blocId != null) {
            return blocService.findById(blocId)
                    .map(bloc -> {
                        chambre.setBloc(bloc);
                        return ResponseEntity.ok(chambreService.save(chambre));
                    })
                    .orElse(ResponseEntity.notFound().<Chambre>build());
        } else {
            return chambreService.findById(id)
                    .map(existingChambre -> {
                        chambre.setBloc(existingChambre.getBloc());
                        return ResponseEntity.ok(chambreService.save(chambre));
                    })
                    .orElse(ResponseEntity.notFound().<Chambre>build());
        }
    }

    @DeleteMapping("/supprimerchambre/{id}")
    public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
        if (!chambreService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        chambreService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
