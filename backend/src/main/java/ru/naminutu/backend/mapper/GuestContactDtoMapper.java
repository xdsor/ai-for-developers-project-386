package ru.naminutu.backend.mapper;

import ru.naminutu.backend.domain.GuestContact;
import ru.naminutu.backend.generated.model.GuestContactDto;

public final class GuestContactDtoMapper {
	private GuestContactDtoMapper() {
	}

	public static GuestContactDto toDto(GuestContact guest) {
		return new GuestContactDto(guest.name(), guest.email());
	}
}
