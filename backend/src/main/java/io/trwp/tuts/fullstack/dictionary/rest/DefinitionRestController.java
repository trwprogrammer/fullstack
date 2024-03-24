package io.trwp.tuts.fullstack.dictionary.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.trwp.tuts.fullstack.dictionary.entities.DefinitionEntity;
import io.trwp.tuts.fullstack.dictionary.services.DefinitionService;


@RestController
public class DefinitionRestController {

    private final DefinitionService definitionService;
    
    public DefinitionRestController(DefinitionService definitionService) {
        this.definitionService = definitionService;
    }

    @GetMapping("definition")
    public DefinitionEntity definition() {
        return definitionService.getRandomDefinition();
    }
    
}
