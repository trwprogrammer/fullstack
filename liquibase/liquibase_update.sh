#!/bin/bash
java -cp liquibase.jar:lib/*:mysql-connector-java-8.0.15.jar liquibase.integration.commandline.Main --changeLogFile=changelog.xml update
