# Fullstack Liquibase - The Real World Programmer

Liquibase is a technology to manage database migrations. It keeps track of changes already applied to a database
and ensures a consistent database state. 

## Liquibase
Install [Liquibase](https://www.liquibase.com/) using one of the many options (outside the scope of this project)

Here is one option install it on MacOS using homebrew


### Install Liquibase using homebrew
```bash
brew install liquibase
```

Take note of installation message to set `LIQUIBASE_HOME` variable correctly
```
You should set the environment variable LIQUIBASE_HOME to
  /opt/homebrew/opt/liquibase/libexec
```


### Create a liquibase directory to contain the changelog files and liquibase configuration
```bash
mkdir liquibase
```

Go to the liquibase directory
```bash
cd liquibase
```

Download MySQL connector JAR file to be able to connect to your database
```bash
wget https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.31/mysql-connector-j-8.0.31.jar
```

### Convenience scripts

* Create a `liquibase_update.sh` script to run Liquibase against your MySQL database

```bash
#!/bin/bash
liquibase --classpath=mysql-connector-j-8.0.31.jar --changeLogFile=changelog.xml update
```

* Make the `liquibase_update.sh` script executable

```bash
chmod u+x liquibase_update.sh
```

* Create a `liquibase.properties` file to point Liquibase to your MySQL database running inside Docker. Modify any properties to match your environment if necessary.

```properties
driver:  com.mysql.cj.jdbc.Driver
url: jdbc:mysql://127.0.0.1:3306/fullstack?allowPublicKeyRetrieval=true&useSSL=false
username: root
password: notagoodpassword
```

* Create a top level `changelog.xml` file

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd">
    <include file="20240323_definitions.xml" relativeToChangelogFile="true"/>
</databaseChangeLog>
```

I like to use my own naming convention to keep files sorted have a brief idea of what the changesets are meant to do. 
`YYYYMMDD_brief_description.xml`. Another idea is to use a project system ticket number to match a changelog along with an issue `FUL-123_definitions.xml`.
This is entirely up to your preference.

* Create your first `changelog` file `20240323_definitions.xml`

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd">
    <changeSet author="therealworldprogrammer" id="definitions_table">
        <createTable tableName="definitions">
            <column name="id" type="VARCHAR(32)">
                <constraints primaryKey="true"/>
            </column>
            <column name="lexical_categories" type="VARCHAR(16)">
                <constraints nullable="false"/>
            </column>
            <column name="title" type="VARCHAR(256)">
                <constraints nullable="false"/>
            </column>
            <column name="definition" type="VARCHAR(1024)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="therealworldprogrammer" id="definitions_data">
        <insert tableName="definitions">
            <column name="id" value="dudoo"/>
            <column name="title" value="Dudoo"/>
            <column name="lexical_categories" value="noun"/>
            <column name="definition" value="The most deformed potato in any given collection of potatoes."/>
        </insert>
        <insert tableName="definitions">
            <column name="id" value="abilene"/>
            <column name="title" value="Abilene"/>
            <column name="lexical_categories" value="adj"/>
            <column name="definition" value="Descriptive of the pleasing coolness on the reverse side of the pillow."/>
        </insert>
        <insert tableName="definitions">
            <column name="id" value="plymouth"/>
            <column name="title" value="Plymouth"/>
            <column name="lexical_categories" value="verb"/>
            <column name="definition" value="To relate an amusing story to someone without remembering that it was they who told it to you in the first place."/>
        </insert>
    </changeSet>
</databaseChangeLog>
```

This creates the dictionary `definitions` table along with some initial definitions. 

Note that I prefer using the Liquibase changelog syntax and avoid using plain `sql` statements if possible. Liquibase
supports a myriad of databases and depending on the driver will translate it based on the driver used. This means as
long as you use the abstractions your code will be portable to any of the other supported relational databases e.g. PostgreSQL 

### Run your changeset on MySQL

```bash
./liquibase_update.sh
```

You should now have a table called `definitions` with three rows