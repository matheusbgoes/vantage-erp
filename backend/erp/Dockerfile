# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia os arquivos (o Render já estará na pasta backend/erp)
COPY . .

# Dá permissão e faz o build
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
