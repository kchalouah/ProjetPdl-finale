package tn.sesame.pdlpdl.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import tn.sesame.pdlpdl.model.entities.Service;
import tn.sesame.pdlpdl.repository.ServiceRepository;
import tn.sesame.pdlpdl.service.IServiceService;

import java.util.List;
import java.util.Optional;

/**
 * Implémentation du service de gestion des services hospitaliers.
 */
@org.springframework.stereotype.Service
public class ServiceServiceImpl implements IServiceService {

    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public Service save(Service entity) {
        return serviceRepository.save(entity);
    }

    @Override
    public List<Service> findAll() {
        return serviceRepository.findAll();
    }

    @Override
    public Optional<Service> findById(Long id) {
        return serviceRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return serviceRepository.existsById(id);
    }

    @Override
    public Optional<Service> findByNom(String nom) {
        return serviceRepository.findByNom(nom);
    }

    @Override
    public boolean existsByNom(String nom) {
        return serviceRepository.existsByNom(nom);
    }
}