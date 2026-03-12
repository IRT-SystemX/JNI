FROM amazoncorretto:11.0.20-alpine3.18 as builder
COPY org/eclipse/digitaltwin/basyx/basyx.aasregistry-service-release-log-mongodb/1.0.0/basyx.aasregistry-service-release-log-mongodb-1.0.0.jar ./
RUN java -Djarmode=layertools -jar basyx.aasregistry-service-release-log-mongodb-1.0.0.jar extract

FROM amazoncorretto:11.0.20-alpine3.18
RUN mkdir /workspace
WORKDIR /workspace
COPY --from=builder dependencies/ ./
COPY --from=builder snapshot-dependencies/ ./
RUN true
COPY --from=builder spring-boot-loader/ ./
COPY --from=builder application/ ./
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=logEvents,mongoDbStorage
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/.urandom", "org.springframework.boot.loader.JarLauncher"]

