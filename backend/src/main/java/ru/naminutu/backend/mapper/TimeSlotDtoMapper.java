package ru.naminutu.backend.mapper;

import java.time.OffsetDateTime;
import java.util.List;
import ru.naminutu.backend.generated.model.TimeSlotDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;

public final class TimeSlotDtoMapper {
	private TimeSlotDtoMapper() {
	}

	public static TimeSlotDto toDto(OffsetDateTime startAt, OffsetDateTime endAt) {
		return new TimeSlotDto()
			.startAt(startAt)
			.endAt(endAt)
			.available(true);
	}

	public static TimeSlotListDto toListDto(List<TimeSlotDto> slots) {
		return new TimeSlotListDto(slots);
	}
}
