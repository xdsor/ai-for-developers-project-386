package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.PublicUsersApi;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UserProfileDto;
import ru.naminutu.backend.service.PublicEventService;

@RestController
public class PublicUsersController implements PublicUsersApi {
	private final PublicEventService publicEventService;

	public PublicUsersController(PublicEventService publicEventService) {
		this.publicEventService = publicEventService;
	}

	@Override
	public ResponseEntity<EventListDto> publicUsersListEvents(String userSlug) {
		return ApiResponseMapper.ok(publicEventService.listEvents(userSlug));
	}

	@Override
	public ResponseEntity<EventDto> publicUsersReadEvent(String userSlug, String eventSlug) {
		return ApiResponseMapper.ok(publicEventService.readEvent(userSlug, eventSlug));
	}

	@Override
	public ResponseEntity<UserProfileDto> publicUsersReadProfile(String userSlug) {
		return ApiResponseMapper.ok(publicEventService.readProfile(userSlug));
	}
}
