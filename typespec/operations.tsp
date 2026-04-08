using Http;

namespace MeetingBooking;

@route("/users")
@tag("Public Users")
interface PublicUsers {
  /** Get a public user profile and all events created by that user. */
  @get
  @route("{userSlug}")
  readProfile(@path userSlug: Slug): UserProfile | Error;

  /** List public events created by a user. */
  @get
  @route("{userSlug}/events")
  listEvents(@path userSlug: Slug): EventList | Error;

  /** Get a public event by user slug and event slug. */
  @get
  @route("{userSlug}/events/{eventSlug}")
  readEvent(@path userSlug: Slug, @path eventSlug: Slug): Event | Error;
}

@route("/users/{userSlug}/events/{eventSlug}")
@tag("Public Bookings")
interface PublicBookings {
  /** List free slots for the next 14 days from the owner's current date. */
  @get
  @route("slots")
  listSlots(@path userSlug: Slug, @path eventSlug: Slug): TimeSlotList | Error;

  /** Create a booking for a free slot in the event owner's 14-day booking window. */
  @post
  @route("bookings")
  createBooking(
    @path userSlug: Slug,
    @path eventSlug: Slug,
    @body body: CreateBookingRequest,
  ): Booking | Error;
}

@route("/admin/users")
@tag("Admin Users")
interface AdminUsers {
  /** Read a user by id. */
  @get
  @route("{userId}")
  read(@path userId: ResourceId): User | Error;
}

@route("/admin/users/{userId}/events")
@tag("Admin Events")
interface AdminEvents {
  /** List events owned by a user. */
  @get
  list(@path userId: ResourceId): EventList | Error;

  /** Create an event owned by a user. */
  @post
  create(@path userId: ResourceId, @body body: CreateEventRequest): Event | Error;

  /** Read an event owned by a user. */
  @get
  @route("{eventId}")
  read(@path userId: ResourceId, @path eventId: ResourceId): Event | Error;

  /** Update an event owned by a user. */
  @patch
  @route("{eventId}")
  update(
    @path userId: ResourceId,
    @path eventId: ResourceId,
    @body body: UpdateEventRequest,
  ): Event | Error;

  /** Delete an event owned by a user. */
  @delete
  @route("{eventId}")
  delete(@path userId: ResourceId, @path eventId: ResourceId): void | Error;
}

@route("/admin/users/{userId}/bookings")
@tag("Admin Bookings")
interface AdminBookings {
  /** List bookings for a user across all owned events. */
  @get
  list(@path userId: ResourceId): BookingList | Error;
}
