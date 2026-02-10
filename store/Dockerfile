# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source and frontend
COPY src src
COPY frontend frontend

# Build the application
RUN ./mvnw clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Convert Render's DATABASE_URL to JDBC format; use PORT for server
ENTRYPOINT ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then export SPRING_DATASOURCE_URL=\"jdbc:postgresql://${DATABASE_URL#postgresql://}\"; fi && java -Dserver.port=${PORT:-8080} -jar app.jar"]
