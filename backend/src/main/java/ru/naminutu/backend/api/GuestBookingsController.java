package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.GuestBookingsApi;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.EventBookingPageDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.service.GuestBookingService;

@RestController
public class GuestBookingsController implements GuestBookingsApi {
	private final GuestBookingService guestBookingService;

	public GuestBookingsController(GuestBookingService guestBookingService) {
		this.guestBookingService = guestBookingService;
	}

	@Override
	public ResponseEntity<EventBookingPageDto> guestBookingsReadBookingPage(String hostSlug, String eventSlug) {
		return ApiResponseMapper.ok(guestBookingService.readBookingPage(hostSlug, eventSlug));
	}

	@Override
	public ResponseEntity<BookingDto> guestBookingsCreateBooking(
		String hostSlug,
		String eventSlug,
		CreateBookingRequestDto createBookingRequestDto
	) {
		return ApiResponseMapper.ok(guestBookingService.createBooking(hostSlug, eventSlug, createBookingRequestDto));
	}

	@Override
	public ResponseEntity<TimeSlotListDto> guestBookingsListSlots(String hostSlug, String eventSlug) {
		return ApiResponseMapper.ok(guestBookingService.listSlots(hostSlug, eventSlug));
	}
}
