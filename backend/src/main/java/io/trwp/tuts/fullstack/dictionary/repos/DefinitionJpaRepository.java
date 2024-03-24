package io.trwp.tuts.fullstack.dictionary.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.trwp.tuts.fullstack.dictionary.entities.DefinitionEntity;

@Repository
public interface DefinitionJpaRepository extends JpaRepository<DefinitionEntity, String> {

}
