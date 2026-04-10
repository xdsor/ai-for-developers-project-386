package ru.naminutu.backend.repository;

import io.vavr.collection.List;
import io.vavr.control.Option;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.UserRecord;

public interface MeetingBookingRepository {
	void resetDemoData();

	Option<UserRecord> findUserById(String userId);

	Option<UserRecord> findUserBySlug(String userSlug);

	Option<EventRecord> findEventById(String eventId);

	Option<EventRecord> findEventBySlug(String ownerId, String eventSlug);

	List<EventRecord> listEvents();

	List<BookingRecord> listBookings();

	List<BookingRecord> listBookingsByOwnerId(String ownerId);

	EventRecord saveEvent(EventRecord event);

	BookingRecord saveBooking(BookingRecord booking);

	void deleteEvent(String eventId);

	void deleteBookingsByEventId(String eventId);
}
