package tn.sesame.pdlpdl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.pdlpdl.model.entities.Diagnostic;
import tn.sesame.pdlpdl.service.IDiagnosticService;

import java.util.List;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    private final IDiagnosticService diagnosticService;

    @Autowired
    public DiagnosticController(IDiagnosticService diagnosticService) {
        this.diagnosticService = diagnosticService;
    }

    @GetMapping("/afficherdiagnostics")
    public ResponseEntity<List<Diagnostic>> getAll() {
        return ResponseEntity.ok(diagnosticService.findAll());
    }

    @GetMapping("/afficherdiagnostic/{id}")
    public ResponseEntity<Diagnostic> getById(@PathVariable Long id) {
        return diagnosticService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouterdiagnostic")
    public ResponseEntity<Diagnostic> create(@RequestBody Diagnostic entity) {
        return ResponseEntity.ok(diagnosticService.save(entity));
    }

    @PutMapping("/modifierdiagnostic/{id}")
    public ResponseEntity<Diagnostic> update(@PathVariable Long id, @RequestBody Diagnostic entity) {
        if (!diagnosticService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id);
        return ResponseEntity.ok(diagnosticService.save(entity));
    }

    @DeleteMapping("/supprimerdiagnostic/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!diagnosticService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        diagnosticService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
