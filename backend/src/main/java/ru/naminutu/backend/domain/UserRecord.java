package ru.naminutu.backend.domain;

public record UserRecord(String id, String name, String slug, String timeZone) {
	public static UserRecord demoUser() {
		return new UserRecord("demo-user", "Demo User", "demo-user", "Europe/Berlin");
	}
}
