package com.globetales.service.impl;

import com.globetales.exception.ResourceNotFoundException;
import com.globetales.service.BaseService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public abstract class BaseServiceImpl<T, D, ID, R extends JpaRepository<T, ID>, M> implements BaseService<D, ID> {
    protected final R repository;
    protected final M mapper;

    protected BaseServiceImpl(R repository, M mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<D> findAll() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<D> findById(ID id) {
        return repository.findById(id)
                .map(this::toDTO);
    }

    @Override
    public D save(D dto) {
        T entity = toEntity(dto);
        return toDTO(repository.save(entity));
    }

    @Override
    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }

    protected abstract D toDTO(T entity);
    protected abstract T toEntity(D dto);
} 