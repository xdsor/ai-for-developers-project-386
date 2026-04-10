package ru.naminutu.backend.service;

import io.vavr.control.Either;
import java.util.List;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.HostProfileDto;
import ru.naminutu.backend.mapper.EventDtoMapper;
import ru.naminutu.backend.mapper.HostDtoMapper;
import ru.naminutu.backend.mapper.HostProfileDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class GuestEventService {
	private final HostService hostService;
	private final MeetingBookingRepository repository;

	public GuestEventService(HostService hostService, MeetingBookingRepository repository) {
		this.hostService = hostService;
		this.repository = repository;
	}

	public Either<DomainError, HostProfileDto> readProfile(String hostSlug) {
		return hostService.findHostBySlug(hostSlug)
			.map(host -> HostProfileDtoMapper.toDto(HostDtoMapper.toDto(host), listEventsForHost(host.id())));
	}

	public Either<DomainError, EventListDto> listEvents(String hostSlug) {
		return hostService.findHostBySlug(hostSlug)
			.map(host -> EventDtoMapper.toListDto(listEventsForHost(host.id())));
	}

	public Either<DomainError, EventDto> readEvent(String hostSlug, String eventSlug) {
		return hostService.findHostBySlug(hostSlug)
			.flatMap(host -> findEventBySlug(host.id(), eventSlug))
			.map(EventDtoMapper::toDto);
	}

	Either<DomainError, EventRecord> findEventBySlug(String hostId, String eventSlug) {
		return repository.findEventBySlug(hostId, eventSlug)
			.toEither(DomainErrors.notFound("Event not found."));
	}

	private List<EventDto> listEventsForHost(String hostId) {
		return repository.listEventsByOwnerId(hostId)
			.sortBy(EventRecord::title)
			.map(EventDtoMapper::toDto)
			.asJava();
	}
}
