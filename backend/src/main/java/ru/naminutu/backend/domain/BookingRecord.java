package ru.naminutu.backend.domain;

import java.time.OffsetDateTime;

public record BookingRecord(
	String id,
	String eventId,
	String ownerId,
	GuestContact guest,
	OffsetDateTime startAt,
	OffsetDateTime endAt,
	OffsetDateTime createdAt
) {
}
