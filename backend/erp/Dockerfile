FROM maven:3.10.1-eclipse-temurin-26 as build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw -B clean package -DskipTests -Dmaven.repo.local=/root/.m2/repository

FROM eclipse-temurin:26-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
