package ru.naminutu.backend.domain;

public record HostRecord(String id, String name, String slug, String timeZone) {
	public static HostRecord demoHost() {
		return new HostRecord("demo-user", "Demo User", "demo-user", "Europe/Berlin");
	}
}
