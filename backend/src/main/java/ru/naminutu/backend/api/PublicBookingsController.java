package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.PublicBookingsApi;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.service.MeetingBookingService;

@RestController
public class PublicBookingsController implements PublicBookingsApi {
	private final MeetingBookingService service;

	public PublicBookingsController(MeetingBookingService service) {
		this.service = service;
	}

	@Override
	public ResponseEntity<BookingDto> publicBookingsCreateBooking(
		String userSlug,
		String eventSlug,
		CreateBookingRequestDto createBookingRequestDto
	) {
		return ApiResponseMapper.ok(service.createBooking(userSlug, eventSlug, createBookingRequestDto));
	}

	@Override
	public ResponseEntity<TimeSlotListDto> publicBookingsListSlots(String userSlug, String eventSlug) {
		return ApiResponseMapper.ok(service.listSlots(userSlug, eventSlug));
	}
}
