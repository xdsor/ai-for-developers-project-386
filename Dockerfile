FROM node:22-alpine AS web-build
WORKDIR /workspace/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /workspace/backend

COPY backend/gradlew backend/build.gradle.kts backend/settings.gradle.kts ./
COPY backend/gradle ./gradle
COPY backend/src ./src

RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=docker

COPY --from=backend-build /workspace/backend/build/libs/*.jar /app/app.jar
COPY --from=web-build /workspace/web/dist /app/static

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
