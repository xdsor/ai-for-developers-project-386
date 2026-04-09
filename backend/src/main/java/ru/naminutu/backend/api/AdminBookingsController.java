package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.AdminBookingsApi;
import ru.naminutu.backend.generated.model.BookingListDto;
import ru.naminutu.backend.service.MeetingBookingService;

@RestController
public class AdminBookingsController implements AdminBookingsApi {
	private final MeetingBookingService service;

	public AdminBookingsController(MeetingBookingService service) {
		this.service = service;
	}

	@Override
	public ResponseEntity<BookingListDto> adminBookingsList(String userId) {
		return ApiResponseMapper.ok(service.listAdminBookings(userId));
	}
}
