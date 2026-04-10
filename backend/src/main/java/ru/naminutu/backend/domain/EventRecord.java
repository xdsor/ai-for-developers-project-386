package ru.naminutu.backend.domain;

import io.vavr.control.Option;
import java.util.UUID;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;

public record EventRecord(
	String id,
	String ownerId,
	String title,
	String description,
	Integer durationMinutes,
	String slug
) {
	public static EventRecord create(String ownerId, CreateEventRequestDto request) {
		return new EventRecord(
			"event-" + UUID.randomUUID(),
			ownerId,
			request.getTitle(),
			request.getDescription(),
			request.getDurationMinutes(),
			request.getSlug()
		);
	}

	public static EventRecord update(EventRecord event, UpdateEventRequestDto request) {
		return new EventRecord(
			event.id(),
			event.ownerId(),
			Option.of(request.getTitle()).getOrElse(event.title()),
			Option.of(request.getDescription()).getOrElse(event.description()),
			Option.of(request.getDurationMinutes()).getOrElse(event.durationMinutes()),
			Option.of(request.getSlug()).getOrElse(event.slug())
		);
	}
}
