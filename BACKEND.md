# Fullstack Backend - The Real World Programmer

## Prerequisites
* [JDK17](https://jdk.java.net/17/)
* [Spring Initializr CLI](https://docs.spring.io/spring-boot/docs/3.2.4/reference/html/cli.html)


## Create spring boot project from option (A) or (B)
See [spring.io](https://spring.io/) for more info on the Java Spring Framework
### Option A: Using Spring Initializr CLI (The cool way)
##### Install Spring Initializer
MacOS using Homebrew
```bash
brew tap spring-io/tap
brew install spring-boot
https://docs.spring.io/spring-boot/docs/current/reference/html/cli.html
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
--artifact-id=liff \
--dependencies=web,devtools,configuration-processor,lombok,data-jpa,mysql \
--packaging=jar \
backend
```

### Option B: Download the Spring app using the following URL and extract
[Spring Initializr Project](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.2.4&packaging=jar&jvmVersion=17&groupId=io.trwp.tuts.fullstack&artifactId=liff&name=liff&description=The%20Real%20World%20Programmer%20-%20Fullstack%20Tutorial&packageName=io.trwp.tuts.fullstack.liff&dependencies=web,devtools,configuration-processor,lombok,data-jpa,mysql)

##  Modify the starter project
Rename `src/main/resources/application.properties` to `src/main/resources/application.yml` and add the following settings:

```yaml
spring:
  application:
    name: trwp-fullstack-tutorial-api
  datasource:
    url: jdbc:mysql://127.0.0.1:33060/fullstack
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
  fullstack-api
┗━━━✦❘༻༺❘✦━━━━┛
```

## Create backend classes

* Rename main class `io.trwp.tuts.fullstack.liff.DemoApplication` to `io.trwp.tuts.fullstack.liff.LiffApplication`
* Create a new package `io.trwp.tuts.fullstack.liff.entities` for JPA Entities
* Create the Liff JPA Entity class `io.trwp.tuts.fullstack.liff.entities.LiffEntity`

```java
package io.trwp.tuts.fullstack.liff.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "liffs")
@Getter
@Setter
public class LiffEntity {
    
    @Id
    private String id;
    private String lexicalCategories;
    private String title;
    private String definition;
}
```

* Create a new package `io.trwp.tuts.fullstack.liff.repos` for JPA Repositories
* Create the Liff JPA Repository class `io.trwp.tuts.fullstack.liff.repos.LiffJpaRepository`

```java
package io.trwp.tuts.fullstack.liff.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.trwp.tuts.fullstack.entities.LiffEntity;

@Repository
public interface LiffJpaRepository extends JpaRepository<LiffEntity, String> {

}
```

* Create a new package `io.trwp.tuts.fullstack.liff.services` for custom Spring services
* Create a new class `io.trwp.tuts.fullstack.liff.services.LiffService`

```java
package io.trwp.tuts.fullstack.liff.services;

import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import io.trwp.tuts.fullstack.entities.LiffEntity;
import io.trwp.tuts.fullstack.repos.LiffJpaRepository;


@Service
public class LiffService {
    private final List<LiffEntity> liffEntities;
    
    public LiffService(LiffJpaRepository liffJpaRepository) {
        liffEntities = liffJpaRepository.findAll();
    }
    
    public LiffEntity getRandomLiff() {
        return liffEntities.get(new Random().nextInt(liffEntities.size()));
    }
}
```

* Create a new package `io.trwp.tuts.fullstack.liff.rest` for custom Rest endpoints
* Create a new class `io.trwp.tuts.fullstack.liff.rest.LiffRestController`

```java
package io.trwp.tuts.fullstack.liff.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.trwp.tuts.fullstack.entities.LiffEntity;
import io.trwp.tuts.fullstack.services.LiffService;


@RestController
public class LiffRestController {

    private final LiffService liffService;
    
    public LiffRestController(LiffService liffService) {
        this.liffService = liffService;
    }

    @GetMapping("liff")
    public LiffEntity liff() {
        return liffService.getRandomLiff();
    }
    
}
```

### Start backend to test
To start backend run the following command in the backend directory
```bash
./mvnw spring-boot:run
```

The Liff Rest service endpoint should now be available at http://localhost:8080/liff. 
You can open in your browser or use the below [cURL](https://curl.se/) command to test

```bash
curl http://localhost:8080/liff
```

You should get some JSON output
```json
{
  "id": "plymouth",
  "lexicalCategories": "verb",
  "title": "Plymouth",
  "definition": "To relate an amusing story to someone without remembering that it was they who told it to you in the first place."
}
```
