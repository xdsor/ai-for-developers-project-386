package ru.naminutu.backend.mapper;

import java.util.List;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.HostDto;
import ru.naminutu.backend.generated.model.HostProfileDto;

public final class HostProfileDtoMapper {
	private HostProfileDtoMapper() {
	}

	public static HostProfileDto toDto(HostDto host, List<EventDto> events) {
		return new HostProfileDto(host, events);
	}
}
