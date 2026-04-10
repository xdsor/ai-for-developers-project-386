package ru.naminutu.backend.repository;

import io.vavr.collection.List;
import io.vavr.control.Option;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Repository;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.UserRecord;

@Repository
public class InMemoryMeetingBookingRepository implements MeetingBookingRepository {
	private final Map<String, UserRecord> usersById = new LinkedHashMap<>();
	private final Map<String, EventRecord> eventsById = new LinkedHashMap<>();
	private final Map<String, BookingRecord> bookingsById = new LinkedHashMap<>();

	public InMemoryMeetingBookingRepository() {
		resetDemoData();
	}

	@Override
	public synchronized void resetDemoData() {
		usersById.clear();
		eventsById.clear();
		bookingsById.clear();

		var user = UserRecord.demoUser();
		var intro = EventRecord.demoIntro(user.id());
		var deepDive = EventRecord.demoDeepDive(user.id());

		usersById.put(user.id(), user);
		eventsById.put(intro.id(), intro);
		eventsById.put(deepDive.id(), deepDive);
	}

	@Override
	public synchronized Option<UserRecord> findUserById(String userId) {
		return Option.of(usersById.get(userId));
	}

	@Override
	public synchronized Option<UserRecord> findUserBySlug(String userSlug) {
		return List.ofAll(usersById.values())
			.find(user -> user.slug().equals(userSlug));
	}

	@Override
	public synchronized Option<EventRecord> findEventById(String eventId) {
		return Option.of(eventsById.get(eventId));
	}

	@Override
	public synchronized Option<EventRecord> findEventBySlug(String ownerId, String eventSlug) {
		return List.ofAll(eventsById.values())
			.find(event -> event.ownerId().equals(ownerId) && event.slug().equals(eventSlug));
	}

	@Override
	public synchronized List<EventRecord> listEvents() {
		return List.ofAll(eventsById.values());
	}

	@Override
	public synchronized List<BookingRecord> listBookings() {
		return List.ofAll(bookingsById.values());
	}

	@Override
	public synchronized List<BookingRecord> listBookingsByOwnerId(String ownerId) {
		return List.ofAll(bookingsById.values())
			.filter(booking -> booking.ownerId().equals(ownerId));
	}

	@Override
	public synchronized EventRecord saveEvent(EventRecord event) {
		eventsById.put(event.id(), event);
		return event;
	}

	@Override
	public synchronized BookingRecord saveBooking(BookingRecord booking) {
		bookingsById.put(booking.id(), booking);
		return booking;
	}

	@Override
	public synchronized void deleteEvent(String eventId) {
		eventsById.remove(eventId);
	}

	@Override
	public synchronized void deleteBookingsByEventId(String eventId) {
		bookingsById.values().removeIf(booking -> booking.eventId().equals(eventId));
	}
}
