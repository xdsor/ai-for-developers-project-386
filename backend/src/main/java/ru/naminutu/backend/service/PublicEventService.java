package ru.naminutu.backend.service;

import io.vavr.control.Either;
import java.util.List;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UserProfileDto;
import ru.naminutu.backend.mapper.EventDtoMapper;
import ru.naminutu.backend.mapper.UserDtoMapper;
import ru.naminutu.backend.mapper.UserProfileDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class PublicEventService {
	private final UserService userService;
	private final MeetingBookingRepository repository;

	public PublicEventService(UserService userService, MeetingBookingRepository repository) {
		this.userService = userService;
		this.repository = repository;
	}

	public Either<DomainError, UserProfileDto> readProfile(String userSlug) {
		return userService.findUserBySlug(userSlug)
			.map(user -> UserProfileDtoMapper.toDto(UserDtoMapper.toDto(user), listEventsForUser(user.id())));
	}

	public Either<DomainError, EventListDto> listEvents(String userSlug) {
		return userService.findUserBySlug(userSlug)
			.map(user -> EventDtoMapper.toListDto(listEventsForUser(user.id())));
	}

	public Either<DomainError, EventDto> readEvent(String userSlug, String eventSlug) {
		return userService.findUserBySlug(userSlug)
			.flatMap(user -> findEventBySlug(user.id(), eventSlug))
			.map(EventDtoMapper::toDto);
	}

	Either<DomainError, EventRecord> findEventBySlug(String userId, String eventSlug) {
		return repository.findEventBySlug(userId, eventSlug)
			.toEither(DomainErrors.notFound("Event not found."));
	}

	private List<EventDto> listEventsForUser(String userId) {
		return repository.listEvents()
			.filter(event -> event.ownerId().equals(userId))
			.sortBy(EventRecord::title)
			.map(EventDtoMapper::toDto)
			.asJava();
	}
}
