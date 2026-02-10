# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
COPY frontend frontend

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -B
RUN ./mvnw clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

# Render sets PORT; convert postgres:// or postgresql:// to jdbc:postgresql://
ENTRYPOINT ["sh", "-c", " \
  if [ -n \"$DATABASE_URL\" ]; then \
    DB_URL=\"$DATABASE_URL\"; \
    DB_URL=\"${DB_URL#postgresql://}\"; \
    DB_URL=\"${DB_URL#postgres://}\"; \
    export SPRING_DATASOURCE_URL=\"jdbc:postgresql://$DB_URL\"; \
  fi; \
  exec java -Dserver.port=${PORT:-8080} -jar app.jar \
"]
