package ru.naminutu.backend.domain;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;

public record BookingRecord(
	String id,
	String eventId,
	String ownerId,
	GuestContact guest,
	OffsetDateTime startAt,
	OffsetDateTime endAt,
	OffsetDateTime createdAt
) {
	public static BookingRecord create(EventRecord event, CreateBookingRequestDto request, OffsetDateTime startAt) {
		return new BookingRecord(
			"booking-" + UUID.randomUUID(),
			event.id(),
			event.ownerId(),
			GuestContact.from(request.getGuest()),
			startAt,
			startAt.plusMinutes(event.durationMinutes()),
			OffsetDateTime.now(ZoneOffset.UTC).withNano(0)
		);
	}
}
