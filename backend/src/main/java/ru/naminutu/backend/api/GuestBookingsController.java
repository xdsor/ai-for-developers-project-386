package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.GuestBookingsApi;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.service.GuestBookingService;

@RestController
public class GuestBookingsController implements GuestBookingsApi {
	private final GuestBookingService guestBookingService;

	public GuestBookingsController(GuestBookingService guestBookingService) {
		this.guestBookingService = guestBookingService;
	}

	@Override
	public ResponseEntity<BookingDto> guestBookingsCreateBooking(
		String userSlug,
		String eventSlug,
		CreateBookingRequestDto createBookingRequestDto
	) {
		return ApiResponseMapper.ok(guestBookingService.createBooking(userSlug, eventSlug, createBookingRequestDto));
	}

	@Override
	public ResponseEntity<TimeSlotListDto> guestBookingsListSlots(String userSlug, String eventSlug) {
		return ApiResponseMapper.ok(guestBookingService.listSlots(userSlug, eventSlug));
	}
}
