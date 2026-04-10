using Http;

namespace MeetingBooking;

@route("/hosts")
@tag("Guest Hosts")
interface GuestHosts {
  /** Get a public host profile and all events created by that host. */
  @get
  @route("{hostSlug}")
  readProfile(@path hostSlug: Slug): HostProfile | Error;

  /** List public events created by a host. */
  @get
  @route("{hostSlug}/events")
  listEvents(@path hostSlug: Slug): EventList | Error;

  /** Get a public event by host slug and event slug. */
  @get
  @route("{hostSlug}/events/{eventSlug}")
  readEvent(@path hostSlug: Slug, @path eventSlug: Slug): Event | Error;
}

@route("/hosts/{hostSlug}/events/{eventSlug}")
@tag("Guest Bookings")
interface GuestBookings {
  /** Get all data needed to render the public booking page for an event. */
  @get
  @route("booking-page")
  readBookingPage(@path hostSlug: Slug, @path eventSlug: Slug): EventBookingPage | Error;

  /** List free slots for the next 14 days from the host's current date. */
  @get
  @route("slots")
  listSlots(@path hostSlug: Slug, @path eventSlug: Slug): TimeSlotList | Error;

  /** Create a booking for a free slot in the event host's 14-day booking window. */
  @post
  @route("bookings")
  createBooking(
    @path hostSlug: Slug,
    @path eventSlug: Slug,
    @body body: CreateBookingRequest,
  ): Booking | Error;
}

@route("/host")
@tag("Host Account")
interface HostAccount {
  /** Read a host by id. */
  @get
  @route("{hostId}")
  read(@path hostId: ResourceId): Host | Error;
}

@route("/host/{hostId}/events")
@tag("Host Events")
interface HostEvents {
  /** List events owned by a host. */
  @get
  list(@path hostId: ResourceId): EventList | Error;

  /** Create an event owned by a host. */
  @post
  create(@path hostId: ResourceId, @body body: CreateEventRequest): Event | Error;

  /** Read an event owned by a host. */
  @get
  @route("{eventId}")
  read(@path hostId: ResourceId, @path eventId: ResourceId): Event | Error;

  /** Update an event owned by a host. */
  @patch
  @route("{eventId}")
  update(
    @path hostId: ResourceId,
    @path eventId: ResourceId,
    @body body: UpdateEventRequest,
  ): Event | Error;

  /** Delete an event owned by a host. */
  @delete
  @route("{eventId}")
  delete(@path hostId: ResourceId, @path eventId: ResourceId): void | Error;
}

@route("/host/{hostId}/bookings")
@tag("Host Bookings")
interface HostBookings {
  /** List bookings for a host across all owned events. */
  @get
  list(@path hostId: ResourceId): BookingList | Error;
}
