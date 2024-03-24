package io.trwp.tuts.fullstack.dictionary.services;

import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import io.trwp.tuts.fullstack.dictionary.entities.DefinitionEntity;
import io.trwp.tuts.fullstack.dictionary.repos.DefinitionJpaRepository;


@Service
public class DefinitionService {
    private final List<DefinitionEntity> definitionEntities;
    
    public DefinitionService(DefinitionJpaRepository definitionJpaRepository) {
        definitionEntities = definitionJpaRepository.findAll();
    }
    
    public DefinitionEntity getRandomDefinition() {
        return definitionEntities.get(new Random().nextInt(definitionEntities.size()));
    }
}
