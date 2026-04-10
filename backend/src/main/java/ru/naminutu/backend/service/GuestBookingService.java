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
import ru.naminutu.backend.domain.UserRecord;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.EventBookingPageDto;
import ru.naminutu.backend.generated.model.TimeSlotDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.mapper.BookingDtoMapper;
import ru.naminutu.backend.mapper.EventBookingPageDtoMapper;
import ru.naminutu.backend.mapper.EventDtoMapper;
import ru.naminutu.backend.mapper.TimeSlotDtoMapper;
import ru.naminutu.backend.mapper.UserDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class GuestBookingService {
	private static final List<LocalTime> DAILY_SLOT_STARTS = List.of(
		LocalTime.of(9, 0),
		LocalTime.of(13, 0),
		LocalTime.of(16, 0)
	);

	private final UserService userService;
	private final GuestEventService guestEventService;
	private final MeetingBookingRepository repository;

	public GuestBookingService(
		UserService userService,
		GuestEventService guestEventService,
		MeetingBookingRepository repository
	) {
		this.userService = userService;
		this.guestEventService = guestEventService;
		this.repository = repository;
	}

	public Either<DomainError, EventBookingPageDto> readBookingPage(String userSlug, String eventSlug) {
		return userService.findUserBySlug(userSlug)
			.flatMap(user -> guestEventService.findEventBySlug(user.id(), eventSlug)
				.map(event -> EventBookingPageDtoMapper.toDto(
					UserDtoMapper.toDto(user),
					EventDtoMapper.toDto(event),
					computeAvailableSlots(user, event)
				)));
	}

	public Either<DomainError, TimeSlotListDto> listSlots(String userSlug, String eventSlug) {
		return userService.findUserBySlug(userSlug)
			.flatMap(user -> guestEventService.findEventBySlug(user.id(), eventSlug)
				.map(event -> computeAvailableSlots(user, event)))
			.map(TimeSlotDtoMapper::toListDto);
	}

	public Either<DomainError, BookingDto> createBooking(String userSlug, String eventSlug, CreateBookingRequestDto request) {
		return userService.findUserBySlug(userSlug)
			.flatMap(user -> guestEventService.findEventBySlug(user.id(), eventSlug)
				.flatMap(event -> validateBookingRequest(user, event, request)
					.map(slot -> BookingRecord.create(event, request, slot))
					.map(repository::saveBooking)
					.map(BookingDtoMapper::toDto)));
	}

	private Either<DomainError, OffsetDateTime> validateBookingRequest(
		UserRecord user,
		EventRecord event,
		CreateBookingRequestDto request
	) {
		return requiredStartAt(request)
			.flatMap(startAt -> availableSlot(event, startAt)
				.map(TimeSlotDto::getStartAt)
				.toEither(slotWindowError(user, startAt)));
	}

	private Either<DomainError, OffsetDateTime> requiredStartAt(CreateBookingRequestDto request) {
		return Option.of(request)
			.map(CreateBookingRequestDto::getStartAt)
			.toEither(DomainErrors.validationFailed("startAt is required."));
	}

	private Option<TimeSlotDto> availableSlot(EventRecord event, OffsetDateTime startAt) {
		return userService.findUserById(event.ownerId())
			.toOption()
			.flatMap(user -> List.ofAll(computeAvailableSlots(user, event))
				.find(slot -> slot.getStartAt().toInstant().equals(startAt.toInstant())));
	}

	private DomainError slotWindowError(UserRecord user, OffsetDateTime startAt) {
		return isWithinWindow(user, startAt)
			? DomainErrors.slotUnavailable("Selected slot is unavailable.")
			: DomainErrors.slotOutsideBookingWindow("Selected slot is outside the booking window.");
	}

	private java.util.List<TimeSlotDto> computeAvailableSlots(UserRecord user, EventRecord event) {
		var zone = ZoneId.of(user.timeZone());
		var today = ZonedDateTime.now(zone).toLocalDate();
		var takenStarts = HashSet.ofAll(repository.listBookings())
			.filter(booking -> booking.eventId().equals(event.id()))
			.map(booking -> booking.startAt().toInstant());

		return List.range(0, 14)
			.flatMap(day -> DAILY_SLOT_STARTS.map(time -> ZonedDateTime.of(today.plusDays(day), time, zone).toOffsetDateTime()))
			.filter(start -> !takenStarts.contains(start.toInstant()))
			.map(start -> TimeSlotDtoMapper.toDto(start, start.plusMinutes(event.durationMinutes())))
			.asJava();
	}

	private boolean isWithinWindow(UserRecord user, OffsetDateTime startAt) {
		var zone = ZoneId.of(user.timeZone());
		var currentDate = ZonedDateTime.now(zone).toLocalDate();
		var startDate = startAt.atZoneSameInstant(zone).toLocalDate();
		return !startDate.isBefore(currentDate) && startDate.isBefore(currentDate.plusDays(14));
	}
}
