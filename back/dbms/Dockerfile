FROM liquibase/liquibase:4.33-alpine

COPY . /liquibase/changelog

USER root
COPY ./scripts/run-migration.sh /liquibase/run-migration.sh
RUN ls -la /liquibase/run-migration.sh && chmod +x /liquibase/run-migration.sh
USER liquibase
CMD ["/liquibase/run-migration.sh"]
