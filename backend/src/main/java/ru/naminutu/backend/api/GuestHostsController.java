package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.GuestHostsApi;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.HostProfileDto;
import ru.naminutu.backend.service.GuestEventService;

@RestController
public class GuestHostsController implements GuestHostsApi {
	private final GuestEventService guestEventService;

	public GuestHostsController(GuestEventService guestEventService) {
		this.guestEventService = guestEventService;
	}

	@Override
	public ResponseEntity<EventListDto> guestHostsListEvents(String hostSlug) {
		return ApiResponseMapper.ok(guestEventService.listEvents(hostSlug));
	}

	@Override
	public ResponseEntity<EventDto> guestHostsReadEvent(String hostSlug, String eventSlug) {
		return ApiResponseMapper.ok(guestEventService.readEvent(hostSlug, eventSlug));
	}

	@Override
	public ResponseEntity<HostProfileDto> guestHostsReadProfile(String hostSlug) {
		return ApiResponseMapper.ok(guestEventService.readProfile(hostSlug));
	}
}
