package ru.naminutu.backend.service;

import io.vavr.collection.HashSet;
import io.vavr.collection.List;
import io.vavr.control.Either;
import io.vavr.control.Option;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.UUID;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.GuestContact;
import ru.naminutu.backend.domain.UserRecord;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.BookingListDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.GuestContactDto;
import ru.naminutu.backend.generated.model.TimeSlotDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;
import ru.naminutu.backend.generated.model.UserDto;
import ru.naminutu.backend.generated.model.UserProfileDto;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class MeetingBookingService {
	private static final List<LocalTime> DAILY_SLOT_STARTS = List.of(
		LocalTime.of(9, 0),
		LocalTime.of(13, 0),
		LocalTime.of(16, 0)
	);

	private final MeetingBookingRepository repository;

	public MeetingBookingService(MeetingBookingRepository repository) {
		this.repository = repository;
	}

	public void resetDemoData() {
		repository.resetDemoData();
	}

	public Either<DomainError, UserProfileDto> readProfile(String userSlug) {
		return findUserBySlug(userSlug)
			.map(user -> UserProfileDtoFactory.create(UserDtoFactory.create(user), listEventsForUser(user.id())));
	}

	public Either<DomainError, EventListDto> listPublicEvents(String userSlug) {
		return findUserBySlug(userSlug)
			.map(user -> EventListDtoFactory.create(listEventsForUser(user.id())));
	}

	public Either<DomainError, EventDto> readPublicEvent(String userSlug, String eventSlug) {
		return findUserBySlug(userSlug)
			.flatMap(user -> findEventBySlug(user.id(), eventSlug))
			.map(EventDtoFactory::create);
	}

	public Either<DomainError, TimeSlotListDto> listSlots(String userSlug, String eventSlug) {
		return findUserBySlug(userSlug)
			.flatMap(user -> findEventBySlug(user.id(), eventSlug)
				.map(event -> computeAvailableSlots(user, event)))
			.map(TimeSlotListDtoFactory::create);
	}

	public Either<DomainError, BookingDto> createBooking(String userSlug, String eventSlug, CreateBookingRequestDto request) {
		return findUserBySlug(userSlug)
			.flatMap(user -> findEventBySlug(user.id(), eventSlug)
				.flatMap(event -> validateBookingRequest(user, event, request)
					.map(slot -> BookingRecordFactory.create(event, request, slot))
					.map(repository::saveBooking)
					.map(BookingDtoFactory::create)));
	}

	public Either<DomainError, UserDto> readAdminUser(String userId) {
		return findUserById(userId).map(UserDtoFactory::create);
	}

	public Either<DomainError, EventListDto> listAdminEvents(String userId) {
		return findUserById(userId)
			.map(user -> EventListDtoFactory.create(listEventsForUser(user.id())));
	}

	public Either<DomainError, EventDto> createAdminEvent(String userId, CreateEventRequestDto request) {
		return findUserById(userId)
			.flatMap(user -> ensureUniqueSlug(user.id(), request.getSlug(), null)
				.map(ignored -> EventRecordFactory.create(user.id(), request))
				.map(repository::saveEvent)
				.map(EventDtoFactory::create));
	}

	public Either<DomainError, EventDto> readAdminEvent(String userId, String eventId) {
		return findEventForOwner(userId, eventId).map(EventDtoFactory::create);
	}

	public Either<DomainError, EventDto> updateAdminEvent(String userId, String eventId, UpdateEventRequestDto request) {
		return findEventForOwner(userId, eventId)
			.flatMap(event -> ensureUniqueSlug(userId, slugOrDefault(request, event), event.id())
				.map(ignored -> EventRecordFactory.update(event, request))
				.map(repository::saveEvent)
				.map(EventDtoFactory::create));
	}

	public Either<DomainError, Void> deleteAdminEvent(String userId, String eventId) {
		return findEventForOwner(userId, eventId)
			.map(event -> {
				repository.deleteEvent(event.id());
				repository.deleteBookingsByEventId(event.id());
				return (Void) null;
			});
	}

	public Either<DomainError, BookingListDto> listAdminBookings(String userId) {
		return findUserById(userId)
			.map(user -> repository.listBookings()
				.filter(booking -> booking.ownerId().equals(user.id()))
				.sorted(Comparator.comparing(BookingRecord::startAt))
				.map(BookingDtoFactory::create)
				.asJava())
			.map(BookingListDtoFactory::create);
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
		return findUserById(event.ownerId())
			.toOption()
			.flatMap(user -> List.ofAll(computeAvailableSlots(user, event))
				.find(slot -> slot.getStartAt().toInstant().equals(startAt.toInstant())));
	}

	private DomainError slotWindowError(UserRecord user, OffsetDateTime startAt) {
		return isWithinWindow(user, startAt)
			? DomainErrors.slotUnavailable("Selected slot is unavailable.")
			: DomainErrors.slotOutsideBookingWindow("Selected slot is outside the booking window.");
	}

	private java.util.List<EventDto> listEventsForUser(String userId) {
		return repository.listEvents()
			.filter(event -> event.ownerId().equals(userId))
			.sortBy(EventRecord::title)
			.map(EventDtoFactory::create)
			.asJava();
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
			.map(start -> TimeSlotDtoFactory.create(start, start.plusMinutes(event.durationMinutes())))
			.asJava();
	}

	private boolean isWithinWindow(UserRecord user, OffsetDateTime startAt) {
		var zone = ZoneId.of(user.timeZone());
		var currentDate = ZonedDateTime.now(zone).toLocalDate();
		var startDate = startAt.atZoneSameInstant(zone).toLocalDate();
		return !startDate.isBefore(currentDate) && startDate.isBefore(currentDate.plusDays(14));
	}

	private Either<DomainError, UserRecord> findUserById(String userId) {
		return repository.findUserById(userId)
			.toEither(DomainErrors.notFound("User not found."));
	}

	private Either<DomainError, UserRecord> findUserBySlug(String userSlug) {
		return repository.findUserBySlug(userSlug)
			.toEither(DomainErrors.notFound("User not found."));
	}

	private Either<DomainError, EventRecord> findEventForOwner(String userId, String eventId) {
		return findUserById(userId)
			.flatMap(ignored -> repository.findEventById(eventId)
				.filter(event -> event.ownerId().equals(userId))
				.toEither(DomainErrors.notFound("Event not found.")));
	}

	private Either<DomainError, EventRecord> findEventBySlug(String userId, String eventSlug) {
		return repository.findEventBySlug(userId, eventSlug)
			.toEither(DomainErrors.notFound("Event not found."));
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

	private static final class UserDtoFactory {
		private UserDtoFactory() {
		}

		private static UserDto create(UserRecord user) {
			return new UserDto(user.id(), user.name(), user.slug(), user.timeZone());
		}
	}

	private static final class EventDtoFactory {
		private EventDtoFactory() {
		}

		private static EventDto create(EventRecord event) {
			return new EventDto(
				event.id(),
				event.ownerId(),
				event.title(),
				event.description(),
				event.durationMinutes(),
				event.slug()
			);
		}
	}

	private static final class BookingDtoFactory {
		private BookingDtoFactory() {
		}

		private static BookingDto create(BookingRecord booking) {
			return new BookingDto(
				booking.id(),
				booking.eventId(),
				booking.ownerId(),
				GuestContactDtoFactory.create(booking.guest()),
				booking.startAt(),
				booking.endAt(),
				booking.createdAt()
			);
		}
	}

	private static final class GuestContactDtoFactory {
		private GuestContactDtoFactory() {
		}

		private static GuestContactDto create(GuestContact guest) {
			return new GuestContactDto(guest.name(), guest.email());
		}
	}

	private static final class UserProfileDtoFactory {
		private UserProfileDtoFactory() {
		}

		private static UserProfileDto create(UserDto user, java.util.List<EventDto> events) {
			return new UserProfileDto(user, events);
		}
	}

	private static final class EventListDtoFactory {
		private EventListDtoFactory() {
		}

		private static EventListDto create(java.util.List<EventDto> events) {
			return new EventListDto(events);
		}
	}

	private static final class TimeSlotListDtoFactory {
		private TimeSlotListDtoFactory() {
		}

		private static TimeSlotListDto create(java.util.List<TimeSlotDto> slots) {
			return new TimeSlotListDto(slots);
		}
	}

	private static final class BookingListDtoFactory {
		private BookingListDtoFactory() {
		}

		private static BookingListDto create(java.util.List<BookingDto> bookings) {
			return new BookingListDto(bookings);
		}
	}

	private static final class TimeSlotDtoFactory {
		private TimeSlotDtoFactory() {
		}

		private static TimeSlotDto create(OffsetDateTime startAt, OffsetDateTime endAt) {
			return new TimeSlotDto()
				.startAt(startAt)
				.endAt(endAt)
				.available(true);
		}
	}

	private static final class EventRecordFactory {
		private EventRecordFactory() {
		}

		private static EventRecord create(String userId, CreateEventRequestDto request) {
			return new EventRecord(
				"event-" + UUID.randomUUID(),
				userId,
				request.getTitle(),
				request.getDescription(),
				request.getDurationMinutes(),
				request.getSlug()
			);
		}

		private static EventRecord update(EventRecord event, UpdateEventRequestDto request) {
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

	private static final class BookingRecordFactory {
		private BookingRecordFactory() {
		}

		private static BookingRecord create(EventRecord event, CreateBookingRequestDto request, OffsetDateTime startAt) {
			return new BookingRecord(
				"booking-" + UUID.randomUUID(),
				event.id(),
				event.ownerId(),
				GuestContactFactory.create(request.getGuest()),
				startAt,
				startAt.plusMinutes(event.durationMinutes()),
				OffsetDateTime.now(ZoneOffset.UTC).withNano(0)
			);
		}
	}

	private static final class GuestContactFactory {
		private GuestContactFactory() {
		}

		private static GuestContact create(GuestContactDto guest) {
			var safeGuest = Option.of(guest).getOrElse(new GuestContactDto("", ""));
			return new GuestContact(safeGuest.getName(), safeGuest.getEmail());
		}
	}
}
