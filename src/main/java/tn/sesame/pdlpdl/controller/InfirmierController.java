package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Infirmier;
import tn.sesame.pdlpdl.service.IInfirmierService;

import java.util.List;

@RestController
@RequestMapping("/api/infirmier")
public class InfirmierController {

    private final IInfirmierService infirmierService;

    @Autowired
    public InfirmierController(IInfirmierService infirmierService) {
        this.infirmierService = infirmierService;
    }

    @GetMapping("/afficherinfirmiers")
    public ResponseEntity<List<Infirmier>> getAll() {
        return ResponseEntity.ok(infirmierService.findAll());
    }

    @GetMapping("/afficherinfirmier/{id}")
    public ResponseEntity<Infirmier> getById(@PathVariable Long id) {
        return infirmierService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterinfirmier")
    public ResponseEntity<Infirmier> create(@RequestBody Infirmier entity) {
        return ResponseEntity.ok(infirmierService.save(entity));
    }

    @PutMapping("/modifierinfirmier/{id}")
    public ResponseEntity<Infirmier> update(@PathVariable Long id, @RequestBody Infirmier entity) {
        if (!infirmierService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(infirmierService.save(entity));
    }

    @DeleteMapping("/supprimerinfirmier/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!infirmierService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        infirmierService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
