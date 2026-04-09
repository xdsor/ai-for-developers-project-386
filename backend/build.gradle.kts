plugins {
	java
	id("org.openapi.generator") version "7.14.0"
	id("org.springframework.boot") version "4.0.5"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "ru.naminutu"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("io.vavr:vavr:0.10.6")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.openapitools:jackson-databind-nullable:0.2.8")
	implementation("io.swagger.core.v3:swagger-annotations-jakarta:2.2.31")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

val generatedOpenApiDir = layout.buildDirectory.dir("generated/openapi")

sourceSets {
	main {
		java.srcDir(generatedOpenApiDir.map { it.dir("src/main/java") })
	}
}

openApiGenerate {
	generatorName.set("spring")
	inputSpec.set(layout.projectDirectory.file("src/main/resources/openapi/openapi.yaml").asFile.absolutePath)
	outputDir.set(generatedOpenApiDir.get().asFile.absolutePath)
	apiPackage.set("ru.naminutu.backend.generated.api")
	modelPackage.set("ru.naminutu.backend.generated.model")
	invokerPackage.set("ru.naminutu.backend.generated.invoker")
	modelNameSuffix.set("Dto")
	globalProperties.set(
		mapOf(
			"apis" to "",
			"models" to "",
			"supportingFiles" to "ApiUtil.java",
			"apiDocs" to "false",
			"modelDocs" to "false",
			"apiTests" to "false",
			"modelTests" to "false",
		)
	)
	configOptions.set(
		mapOf(
			"interfaceOnly" to "true",
			"useResponseEntity" to "true",
			"useSpringBoot3" to "true",
			"useJakartaEe" to "true",
			"performBeanValidation" to "true",
			"dateLibrary" to "java8",
			"hideGenerationTimestamp" to "true",
			"useTags" to "true",
		)
	)
}

tasks.named("compileJava") {
	dependsOn(tasks.named("openApiGenerate"))
}

tasks.withType<Test> {
	useJUnitPlatform()
}
