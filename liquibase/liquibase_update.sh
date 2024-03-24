#!/bin/bash
liquibase --classpath=mysql-connector-j-8.0.31.jar --changeLogFile=changelog.xml update
