package ru.naminutu.backend.mapper;

import java.util.List;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;

public final class EventDtoMapper {
	private EventDtoMapper() {
	}

	public static EventDto toDto(EventRecord event) {
		return new EventDto(
			event.id(),
			event.ownerId(),
			event.title(),
			event.description(),
			event.durationMinutes(),
			event.slug()
		);
	}

	public static EventListDto toListDto(List<EventDto> events) {
		return new EventListDto(events);
	}
}
