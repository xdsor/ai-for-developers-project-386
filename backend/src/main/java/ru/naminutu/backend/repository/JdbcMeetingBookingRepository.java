package ru.naminutu.backend.repository;

import io.vavr.collection.List;
import io.vavr.control.Option;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.GuestContact;
import ru.naminutu.backend.domain.HostRecord;

@Repository
public class JdbcMeetingBookingRepository implements MeetingBookingRepository {
	private final JdbcClient jdbcClient;

	public JdbcMeetingBookingRepository(JdbcClient jdbcClient) {
		this.jdbcClient = jdbcClient;
	}

	@Override
	public void clear() {
		jdbcClient.sql("DELETE FROM bookings").update();
		jdbcClient.sql("DELETE FROM events").update();
		jdbcClient.sql("DELETE FROM hosts").update();
	}

	@Override
	public HostRecord saveHost(HostRecord host) {
		jdbcClient.sql("""
			MERGE INTO hosts (id, name, slug, time_zone)
			KEY (id)
			VALUES (?, ?, ?, ?)
			""")
			.params(host.id(), host.name(), host.slug(), host.timeZone())
			.update();
		return host;
	}

	@Override
	public Option<HostRecord> findHostById(String hostId) {
		return Option.ofOptional(
			jdbcClient.sql("""
				SELECT id, name, slug, time_zone
				FROM hosts
				WHERE id = ?
				""")
				.param(hostId)
				.query(this::mapHost)
				.optional()
		);
	}

	@Override
	public Option<HostRecord> findHostBySlug(String hostSlug) {
		return Option.ofOptional(
			jdbcClient.sql("""
				SELECT id, name, slug, time_zone
				FROM hosts
				WHERE slug = ?
				""")
				.param(hostSlug)
				.query(this::mapHost)
				.optional()
		);
	}

	@Override
	public Option<EventRecord> findEventById(String eventId) {
		return Option.ofOptional(
			jdbcClient.sql("""
				SELECT id, owner_id, title, description, duration_minutes, slug
				FROM events
				WHERE id = ?
				""")
				.param(eventId)
				.query(this::mapEvent)
				.optional()
		);
	}

	@Override
	public Option<EventRecord> findEventBySlug(String ownerId, String eventSlug) {
		return Option.ofOptional(
			jdbcClient.sql("""
				SELECT id, owner_id, title, description, duration_minutes, slug
				FROM events
				WHERE owner_id = ? AND slug = ?
				""")
				.params(ownerId, eventSlug)
				.query(this::mapEvent)
				.optional()
		);
	}

	@Override
	public List<EventRecord> listEvents() {
		return List.ofAll(
			jdbcClient.sql("""
				SELECT id, owner_id, title, description, duration_minutes, slug
				FROM events
				""")
				.query(this::mapEvent)
				.list()
		);
	}

	@Override
	public List<EventRecord> listEventsByOwnerId(String ownerId) {
		return List.ofAll(
			jdbcClient.sql("""
				SELECT id, owner_id, title, description, duration_minutes, slug
				FROM events
				WHERE owner_id = ?
				""")
				.param(ownerId)
				.query(this::mapEvent)
				.list()
		);
	}

	@Override
	public List<BookingRecord> listBookings() {
		return List.ofAll(
			jdbcClient.sql("""
				SELECT b.id, b.event_id, e.owner_id, b.guest_name, b.guest_email, b.start_at, b.end_at, b.created_at
				FROM bookings b
				JOIN events e ON e.id = b.event_id
				""")
				.query(this::mapBooking)
				.list()
		);
	}

	@Override
	public List<BookingRecord> listBookingsByOwnerId(String ownerId) {
		return List.ofAll(
			jdbcClient.sql("""
				SELECT b.id, b.event_id, e.owner_id, b.guest_name, b.guest_email, b.start_at, b.end_at, b.created_at
				FROM bookings b
				JOIN events e ON e.id = b.event_id
				WHERE e.owner_id = ?
				""")
				.param(ownerId)
				.query(this::mapBooking)
				.list()
		);
	}

	@Override
	public EventRecord saveEvent(EventRecord event) {
		jdbcClient.sql("""
			MERGE INTO events (id, owner_id, title, description, duration_minutes, slug)
			KEY (id)
			VALUES (?, ?, ?, ?, ?, ?)
			""")
			.params(
				event.id(),
				event.ownerId(),
				event.title(),
				event.description(),
				event.durationMinutes(),
				event.slug()
			)
			.update();
		return event;
	}

	@Override
	public BookingRecord saveBooking(BookingRecord booking) {
		jdbcClient.sql("""
			INSERT INTO bookings (id, event_id, guest_name, guest_email, start_at, end_at, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
			""")
			.params(
				booking.id(),
				booking.eventId(),
				booking.guest().name(),
				booking.guest().email(),
				booking.startAt(),
				booking.endAt(),
				booking.createdAt()
			)
			.update();
		return booking;
	}

	@Override
	public void deleteEvent(String eventId) {
		jdbcClient.sql("DELETE FROM events WHERE id = ?")
			.param(eventId)
			.update();
	}

	@Override
	public void deleteBookingsByEventId(String eventId) {
		jdbcClient.sql("DELETE FROM bookings WHERE event_id = ?")
			.param(eventId)
			.update();
	}

	private HostRecord mapHost(ResultSet resultSet, int rowNum) throws SQLException {
		return new HostRecord(
			resultSet.getString("id"),
			resultSet.getString("name"),
			resultSet.getString("slug"),
			resultSet.getString("time_zone")
		);
	}

	private EventRecord mapEvent(ResultSet resultSet, int rowNum) throws SQLException {
		return new EventRecord(
			resultSet.getString("id"),
			resultSet.getString("owner_id"),
			resultSet.getString("title"),
			resultSet.getString("description"),
			resultSet.getInt("duration_minutes"),
			resultSet.getString("slug")
		);
	}

	private BookingRecord mapBooking(ResultSet resultSet, int rowNum) throws SQLException {
		return new BookingRecord(
			resultSet.getString("id"),
			resultSet.getString("event_id"),
			resultSet.getString("owner_id"),
			new GuestContact(resultSet.getString("guest_name"), resultSet.getString("guest_email")),
			resultSet.getObject("start_at", java.time.OffsetDateTime.class),
			resultSet.getObject("end_at", java.time.OffsetDateTime.class),
			resultSet.getObject("created_at", java.time.OffsetDateTime.class)
		);
	}
}
