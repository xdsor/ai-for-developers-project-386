package ru.naminutu.backend.mapper;

import ru.naminutu.backend.domain.HostRecord;
import ru.naminutu.backend.generated.model.HostDto;

public final class HostDtoMapper {
	private HostDtoMapper() {
	}

	public static HostDto toDto(HostRecord host) {
		return new HostDto(host.id(), host.name(), host.slug(), host.timeZone());
	}
}
