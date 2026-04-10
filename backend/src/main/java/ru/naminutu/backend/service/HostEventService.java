package ru.naminutu.backend.service;

import io.vavr.control.Either;
import io.vavr.control.Option;
import java.util.List;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;
import ru.naminutu.backend.mapper.EventDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class HostEventService {
	private final HostService hostService;
	private final MeetingBookingRepository repository;

	public HostEventService(HostService hostService, MeetingBookingRepository repository) {
		this.hostService = hostService;
		this.repository = repository;
	}

	public Either<DomainError, EventListDto> listEvents(String hostId) {
		return hostService.findHostById(hostId)
			.map(host -> EventDtoMapper.toListDto(listEventsForHost(host.id())));
	}

	public Either<DomainError, EventDto> createEvent(String hostId, CreateEventRequestDto request) {
		return hostService.findHostById(hostId)
			.flatMap(host -> ensureUniqueSlug(host.id(), request.getSlug(), null)
				.map(ignored -> EventRecord.create(host.id(), request))
				.map(repository::saveEvent)
				.map(EventDtoMapper::toDto));
	}

	public Either<DomainError, EventDto> readEvent(String hostId, String eventId) {
		return findEventForHost(hostId, eventId).map(EventDtoMapper::toDto);
	}

	public Either<DomainError, EventDto> updateEvent(String hostId, String eventId, UpdateEventRequestDto request) {
		return findEventForHost(hostId, eventId)
			.flatMap(event -> ensureUniqueSlug(hostId, slugOrDefault(request, event), event.id())
				.map(ignored -> EventRecord.update(event, request))
				.map(repository::saveEvent)
				.map(EventDtoMapper::toDto));
	}

	public Either<DomainError, Void> deleteEvent(String hostId, String eventId) {
		return findEventForHost(hostId, eventId)
			.map(event -> {
				repository.deleteEvent(event.id());
				repository.deleteBookingsByEventId(event.id());
				return null;
			});
	}

	private Either<DomainError, EventRecord> findEventForHost(String hostId, String eventId) {
		return hostService.findHostById(hostId)
			.flatMap(ignored -> repository.findEventById(eventId)
				.filter(event -> event.ownerId().equals(hostId))
				.toEither(DomainErrors.notFound("Event not found.")));
	}

	private Either<DomainError, String> ensureUniqueSlug(String hostId, String slug, String ignoredEventId) {
		var duplicateExists = repository.findEventBySlug(hostId, slug)
			.exists(event -> !event.id().equals(ignoredEventId));

		return duplicateExists
			? Either.left(DomainErrors.slugAlreadyExists("Event slug already exists."))
			: Either.right(slug);
	}

	private String slugOrDefault(UpdateEventRequestDto request, EventRecord event) {
		return Option.of(request.getSlug()).getOrElse(event.slug());
	}

	private List<EventDto> listEventsForHost(String hostId) {
		return repository.listEventsByOwnerId(hostId)
			.sortBy(EventRecord::title)
			.map(EventDtoMapper::toDto)
			.asJava();
	}
}
