package ru.naminutu.backend.mapper;

import java.util.List;
import ru.naminutu.backend.generated.model.EventBookingPageDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.TimeSlotDto;
import ru.naminutu.backend.generated.model.UserDto;

public final class EventBookingPageDtoMapper {
	private EventBookingPageDtoMapper() {
	}

	public static EventBookingPageDto toDto(UserDto host, EventDto event, List<TimeSlotDto> slots) {
		return new EventBookingPageDto(host, event, slots);
	}
}
