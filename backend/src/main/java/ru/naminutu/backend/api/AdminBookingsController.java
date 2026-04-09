package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.AdminBookingsApi;
import ru.naminutu.backend.generated.model.BookingListDto;
import ru.naminutu.backend.service.AdminBookingService;

@RestController
public class AdminBookingsController implements AdminBookingsApi {
	private final AdminBookingService adminBookingService;

	public AdminBookingsController(AdminBookingService adminBookingService) {
		this.adminBookingService = adminBookingService;
	}

	@Override
	public ResponseEntity<BookingListDto> adminBookingsList(String userId) {
		return ApiResponseMapper.ok(adminBookingService.listBookings(userId));
	}
}
