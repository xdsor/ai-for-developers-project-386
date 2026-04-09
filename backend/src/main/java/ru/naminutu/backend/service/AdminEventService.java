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
public class AdminEventService {
	private final UserService userService;
	private final MeetingBookingRepository repository;

	public AdminEventService(UserService userService, MeetingBookingRepository repository) {
		this.userService = userService;
		this.repository = repository;
	}

	public Either<DomainError, EventListDto> listEvents(String userId) {
		return userService.findUserById(userId)
			.map(user -> EventDtoMapper.toListDto(listEventsForUser(user.id())));
	}

	public Either<DomainError, EventDto> createEvent(String userId, CreateEventRequestDto request) {
		return userService.findUserById(userId)
			.flatMap(user -> ensureUniqueSlug(user.id(), request.getSlug(), null)
				.map(ignored -> EventRecord.create(user.id(), request))
				.map(repository::saveEvent)
				.map(EventDtoMapper::toDto));
	}

	public Either<DomainError, EventDto> readEvent(String userId, String eventId) {
		return findEventForOwner(userId, eventId).map(EventDtoMapper::toDto);
	}

	public Either<DomainError, EventDto> updateEvent(String userId, String eventId, UpdateEventRequestDto request) {
		return findEventForOwner(userId, eventId)
			.flatMap(event -> ensureUniqueSlug(userId, slugOrDefault(request, event), event.id())
				.map(ignored -> EventRecord.update(event, request))
				.map(repository::saveEvent)
				.map(EventDtoMapper::toDto));
	}

	public Either<DomainError, Void> deleteEvent(String userId, String eventId) {
		return findEventForOwner(userId, eventId)
			.map(event -> {
				repository.deleteEvent(event.id());
				repository.deleteBookingsByEventId(event.id());
				return (Void) null;
			});
	}

	private Either<DomainError, EventRecord> findEventForOwner(String userId, String eventId) {
		return userService.findUserById(userId)
			.flatMap(ignored -> repository.findEventById(eventId)
				.filter(event -> event.ownerId().equals(userId))
				.toEither(DomainErrors.notFound("Event not found.")));
	}

	private Either<DomainError, String> ensureUniqueSlug(String userId, String slug, String ignoredEventId) {
		var duplicateExists = repository.listEvents()
			.exists(event -> event.ownerId().equals(userId)
				&& event.slug().equals(slug)
				&& !event.id().equals(ignoredEventId));

		return duplicateExists
			? Either.left(DomainErrors.slugAlreadyExists("Event slug already exists."))
			: Either.right(slug);
	}

	private String slugOrDefault(UpdateEventRequestDto request, EventRecord event) {
		return Option.of(request.getSlug()).getOrElse(event.slug());
	}

	private List<EventDto> listEventsForUser(String userId) {
		return repository.listEvents()
			.filter(event -> event.ownerId().equals(userId))
			.sortBy(EventRecord::title)
			.map(EventDtoMapper::toDto)
			.asJava();
	}
}
