FROM maven:3.10.1-eclipse-temurin-26 as build
WORKDIR /app
COPY pom.xml mvnw .
COPY .mvn .mvn
COPY src src
RUN ./mvnw -B package -DskipTests -Dmaven.repo.local=/root/.m2/repository

FROM eclipse-temurin:26-jre-jammy
WORKDIR /app
COPY --from=build /app/target/erp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
