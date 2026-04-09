package ru.naminutu.backend.domain;

public record EventRecord(
	String id,
	String ownerId,
	String title,
	String description,
	Integer durationMinutes,
	String slug
) {
	public static EventRecord demoIntro(String ownerId) {
		return new EventRecord(
			"event-intro",
			ownerId,
			"Intro call",
			"15-minute intro to align on the task.",
			15,
			"intro-call"
		);
	}

	public static EventRecord demoDeepDive(String ownerId) {
		return new EventRecord(
			"event-deep-dive",
			ownerId,
			"Deep dive",
			"45-minute working session for implementation details.",
			45,
			"deep-dive"
		);
	}
}
