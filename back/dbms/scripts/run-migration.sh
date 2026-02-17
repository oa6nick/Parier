#!/bin/sh

echo "parierDB migration..."
liquibase --logLevel=INFO --searchPath=/liquibase/changelog update --username=$DB_USERNAME --password=$DB_PASSWORD --url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/parier_db --driver=org.postgresql.Driver --changeLogFile=db.changelog.schema.xml -Duser.admin=$DB_USERNAME -Duser.connect.pw=$DB_PASSWORD