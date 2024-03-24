# Fullstack Backend - The Real World Programmer

## Prerequisites
* [JDK17](https://jdk.java.net/17/)
* [Spring Initializr CLI](https://docs.spring.io/spring-boot/docs/3.2.4/reference/html/cli.html)


## Create spring boot project from option (A) or (B)
See [spring.io](https://spring.io/) for more info on the Java Spring Framework
### Option A: Using Spring Initializr CLI (The cool way)

See [Spring Initializr CLI](https://docs.spring.io/spring-boot/docs/current/reference/html/cli.html) for more info

##### Install Spring Initializer
MacOS using Homebrew
```bash
brew tap spring-io/tap
brew install spring-boot
```

##### Create backend using Spring Initializr CLI
See [Spring Initializr](https://start.spring.io) for more info

```bash
spring init \
--description="The Real World Programmer - Fullstack Tutorial" \
--language=java \
--boot-version=3.2.4 \
--java-version=17 \
--version=0.0.1-SNAPSHOT \
--build=maven \
--group=io.trwp.tuts.fullstack \
--artifact-id=dictionary \
--dependencies=web,devtools,configuration-processor,lombok,data-jpa,mysql \
--packaging=jar \
backend
```

### Option B: Download the Spring app using the following URL and extract
[Spring Initializr Project](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.2.4&packaging=jar&jvmVersion=17&groupId=io.trwp.tuts.fullstack&artifactId=dictionary&name=dictionary&description=The%20Real%20World%20Programmer%20-%20Fullstack%20Tutorial&packageName=io.trwp.tuts.fullstack.dictionary&dependencies=web,devtools,configuration-processor,lombok,data-jpa,mysql)

##  Modify the starter project
Rename `src/main/resources/application.properties` to `src/main/resources/application.yml` and add the following settings:

```yaml
spring:
  application:
    name: trwp-fullstack-dictionary
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/fullstack
    username: root
    password: notagoodpassword
    hikari.connection-init-sql: select 1
    hikari.connection-timeout: 30000
    hikari.maximum-pool-size: 10
    hikari.driver-class-name: com.mysql.cj.jdbc.Driver
```

## For fun create a custom Spring banner file

Create a new file `src/main/resources/banner.txt` with contents:

```text
┏━━━✦❘༻༺❘✦━━━━┓
  fullstack-dic
┗━━━✦❘༻༺❘✦━━━━┛
```

## Create backend classes

* Rename main class `io.trwp.tuts.fullstack.dictionary.DemoApplication` to `io.trwp.tuts.fullstack.dictionary.DictionaryApplication`
* Create a new package `io.trwp.tuts.fullstack.dictionary.entities` for JPA Entities
* Create a Dictionary Definition JPA Entity class `io.trwp.tuts.fullstack.dictionary.entities.DefinitionEntity`

```java
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
```

* Create a new package `io.trwp.tuts.fullstack.dictionary.repos` for JPA Repositories
* Create the Definition JPA Repository class `io.trwp.tuts.fullstack.dictionary.repos.DefinitionJpaRepository`

```java
package io.trwp.tuts.fullstack.dictionary.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.trwp.tuts.fullstack.dictionary.entities.DefinitionEntity;

@Repository
public interface DefinitionJpaRepository extends JpaRepository<DefinitionEntity, String> {

}
```

* Create a new package `io.trwp.tuts.fullstack.dictionary.services` for custom Spring services
* Create a new class `io.trwp.tuts.fullstack.dictionary.services.DefinitionService`

```java
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
```

* Create a new package `io.trwp.tuts.fullstack.definition.rest` for custom Rest endpoints
* Create a new class `io.trwp.tuts.fullstack.definition.rest.DefinitionRestController`

```java
package io.trwp.tuts.fullstack.definition.rest;

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
```

### Start backend to test
To start backend run the following command in the backend directory
```bash
./mvnw spring-boot:run
```

The Definition Rest service endpoint should now be available at http://localhost:8080/definition. 
You can open in your browser or use the below [cURL](https://curl.se/) command to test

```bash
curl http://localhost:8080/definition
```

You should get some JSON output
```json
{
  "id": "computer",
  "lexicalCategories": "noun",
  "title": "Computer",
  "definition": "An electronic device for storing and processing data, typically in binary form, according to instructions given to it in a variable program."
}
```
