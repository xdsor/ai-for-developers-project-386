package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.GuestUsersApi;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UserProfileDto;
import ru.naminutu.backend.service.GuestEventService;

@RestController
public class GuestUsersController implements GuestUsersApi {
	private final GuestEventService guestEventService;

	public GuestUsersController(GuestEventService guestEventService) {
		this.guestEventService = guestEventService;
	}

	@Override
	public ResponseEntity<EventListDto> guestUsersListEvents(String userSlug) {
		return ApiResponseMapper.ok(guestEventService.listEvents(userSlug));
	}

	@Override
	public ResponseEntity<EventDto> guestUsersReadEvent(String userSlug, String eventSlug) {
		return ApiResponseMapper.ok(guestEventService.readEvent(userSlug, eventSlug));
	}

	@Override
	public ResponseEntity<UserProfileDto> guestUsersReadProfile(String userSlug) {
		return ApiResponseMapper.ok(guestEventService.readProfile(userSlug));
	}
}
