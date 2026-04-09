package ru.naminutu.backend.domain;

import io.vavr.control.Option;
import ru.naminutu.backend.generated.model.GuestContactDto;

public record GuestContact(String name, String email) {
	public static GuestContact from(GuestContactDto dto) {
		var safe = Option.of(dto).getOrElse(new GuestContactDto("", ""));
		return new GuestContact(safe.getName(), safe.getEmail());
	}
}
