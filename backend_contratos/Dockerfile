FROM gradle:8.14.3-jdk21-alpine AS builder
WORKDIR /workspace

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
RUN chmod +x gradlew

COPY src ./src
RUN ./gradlew clean bootJar --no-daemon -q

# Seleciona o jar executável (não plain)
RUN cp "$(ls build/libs/*.jar | grep -v 'plain' | head -n 1)" /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o jar da build anterior
COPY --from=builder /workspace/app.jar /app/app.jar


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

