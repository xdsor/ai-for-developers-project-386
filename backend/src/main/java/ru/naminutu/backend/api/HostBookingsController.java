package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.HostBookingsApi;
import ru.naminutu.backend.generated.model.BookingListDto;
import ru.naminutu.backend.service.HostBookingService;

@RestController
public class HostBookingsController implements HostBookingsApi {
	private final HostBookingService hostBookingService;

	public HostBookingsController(HostBookingService hostBookingService) {
		this.hostBookingService = hostBookingService;
	}

	@Override
	public ResponseEntity<BookingListDto> hostBookingsList(String hostId) {
		return ApiResponseMapper.ok(hostBookingService.listBookings(hostId));
	}
}
