package io.trwp.tuts.fullstack.dictionary.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "definitions")
@Getter
@Setter
public class DefinitionEntity {
    
    @Id
    private String id;
    private String lexicalCategories;
    private String title;
    private String definition;
}
