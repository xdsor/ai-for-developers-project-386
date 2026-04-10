package ru.naminutu.backend.service;

import io.vavr.collection.HashSet;
import io.vavr.collection.List;
import io.vavr.control.Either;
import io.vavr.control.Option;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.HostRecord;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.EventBookingPageDto;
import ru.naminutu.backend.generated.model.TimeSlotDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.mapper.BookingDtoMapper;
import ru.naminutu.backend.mapper.EventBookingPageDtoMapper;
import ru.naminutu.backend.mapper.EventDtoMapper;
import ru.naminutu.backend.mapper.HostDtoMapper;
import ru.naminutu.backend.mapper.TimeSlotDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class GuestBookingService {

	private final HostService hostService;
	private final GuestEventService guestEventService;
	private final MeetingBookingRepository repository;

	public GuestBookingService(
		HostService hostService,
		GuestEventService guestEventService,
		MeetingBookingRepository repository
	) {
		this.hostService = hostService;
		this.guestEventService = guestEventService;
		this.repository = repository;
	}

	public Either<DomainError, EventBookingPageDto> readBookingPage(String hostSlug, String eventSlug) {
		return hostService.findHostBySlug(hostSlug)
			.flatMap(host -> guestEventService.findEventBySlug(host.id(), eventSlug)
				.map(event -> EventBookingPageDtoMapper.toDto(
					HostDtoMapper.toDto(host),
					EventDtoMapper.toDto(event),
					computeAvailableSlots(host, event)
				)));
	}

	public Either<DomainError, TimeSlotListDto> listSlots(String hostSlug, String eventSlug) {
		return hostService.findHostBySlug(hostSlug)
			.flatMap(host -> guestEventService.findEventBySlug(host.id(), eventSlug)
				.map(event -> computeAvailableSlots(host, event)))
			.map(TimeSlotDtoMapper::toListDto);
	}

	public Either<DomainError, BookingDto> createBooking(String hostSlug, String eventSlug, CreateBookingRequestDto request) {
		return hostService.findHostBySlug(hostSlug)
			.flatMap(host -> guestEventService.findEventBySlug(host.id(), eventSlug)
				.flatMap(event -> validateBookingRequest(host, event, request)
					.map(slot -> BookingRecord.create(event, request, slot))
					.map(repository::saveBooking)
					.map(BookingDtoMapper::toDto)));
	}

	private Either<DomainError, OffsetDateTime> validateBookingRequest(
		HostRecord host,
		EventRecord event,
		CreateBookingRequestDto request
	) {
		return requiredStartAt(request)
			.flatMap(startAt -> availableSlot(event, startAt)
				.map(TimeSlotDto::getStartAt)
				.toEither(slotWindowError(host, startAt)));
	}

	private Either<DomainError, OffsetDateTime> requiredStartAt(CreateBookingRequestDto request) {
		return Option.of(request)
			.map(CreateBookingRequestDto::getStartAt)
			.toEither(DomainErrors.validationFailed("startAt is required."));
	}

	private Option<TimeSlotDto> availableSlot(EventRecord event, OffsetDateTime startAt) {
		return hostService.findHostById(event.ownerId())
			.toOption()
			.flatMap(host -> List.ofAll(computeAvailableSlots(host, event))
				.find(slot -> slot.getStartAt().toInstant().equals(startAt.toInstant())));
	}

	private DomainError slotWindowError(HostRecord host, OffsetDateTime startAt) {
		return isWithinWindow(host, startAt)
			? DomainErrors.slotUnavailable("Selected slot is unavailable.")
			: DomainErrors.slotOutsideBookingWindow("Selected slot is outside the booking window.");
	}

	private java.util.List<TimeSlotDto> computeAvailableSlots(HostRecord host, EventRecord event) {
		var zone = ZoneId.of(host.timeZone());
		var today = ZonedDateTime.now(zone).toLocalDate();
		int duration = event.durationMinutes();
		var takenStarts = HashSet.ofAll(repository.listBookingsByOwnerId(event.ownerId()))
			.map(booking -> booking.startAt().toInstant());

		int slotsPerDay = 1440 / duration;
		var dailySlots = List.range(0, slotsPerDay)
			.map(i -> LocalTime.MIDNIGHT.plusMinutes((long) i * duration));

		return List.range(0, 14)
			.flatMap(day -> dailySlots.map(time -> ZonedDateTime.of(today.plusDays(day), time, zone).toOffsetDateTime()))
			.filter(start -> !takenStarts.contains(start.toInstant()))
			.map(start -> TimeSlotDtoMapper.toDto(start, start.plusMinutes(duration)))
			.asJava();
	}

	private boolean isWithinWindow(HostRecord host, OffsetDateTime startAt) {
		var zone = ZoneId.of(host.timeZone());
		var currentDate = ZonedDateTime.now(zone).toLocalDate();
		var startDate = startAt.atZoneSameInstant(zone).toLocalDate();
		return !startDate.isBefore(currentDate) && startDate.isBefore(currentDate.plusDays(14));
	}
}
