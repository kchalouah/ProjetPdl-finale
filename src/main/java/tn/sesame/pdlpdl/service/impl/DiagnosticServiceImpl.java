package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.pdlpdl.model.entities.Consultation;
import tn.sesame.pdlpdl.model.entities.Diagnostic;
import tn.sesame.pdlpdl.repository.DiagnosticRepository;
import tn.sesame.pdlpdl.service.IDiagnosticService;

import java.util.List;
import java.util.Optional;

@Service
public class DiagnosticServiceImpl implements IDiagnosticService {

    private final DiagnosticRepository diagnosticRepository;

    @Autowired
    public DiagnosticServiceImpl(DiagnosticRepository diagnosticRepository) {
        this.diagnosticRepository = diagnosticRepository;
    }

    @Override
    public Diagnostic save(Diagnostic entity) {
        return diagnosticRepository.save(entity);
    }

    @Override
    public List<Diagnostic> findAll() {
        return diagnosticRepository.findAll();
    }

    @Override
    public Optional<Diagnostic> findById(Long id) {
        return diagnosticRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        diagnosticRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return diagnosticRepository.existsById(id);
    }

    @Override
    public List<Diagnostic> findByConsultations(List<Consultation> consultations) {
        return diagnosticRepository.findByConsultationIn(consultations);
    }
}