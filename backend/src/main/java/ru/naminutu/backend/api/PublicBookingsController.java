package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.PublicBookingsApi;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.CreateBookingRequestDto;
import ru.naminutu.backend.generated.model.TimeSlotListDto;
import ru.naminutu.backend.service.PublicBookingService;

@RestController
public class PublicBookingsController implements PublicBookingsApi {
	private final PublicBookingService publicBookingService;

	public PublicBookingsController(PublicBookingService publicBookingService) {
		this.publicBookingService = publicBookingService;
	}

	@Override
	public ResponseEntity<BookingDto> publicBookingsCreateBooking(
		String userSlug,
		String eventSlug,
		CreateBookingRequestDto createBookingRequestDto
	) {
		return ApiResponseMapper.ok(publicBookingService.createBooking(userSlug, eventSlug, createBookingRequestDto));
	}

	@Override
	public ResponseEntity<TimeSlotListDto> publicBookingsListSlots(String userSlug, String eventSlug) {
		return ApiResponseMapper.ok(publicBookingService.listSlots(userSlug, eventSlug));
	}
}
