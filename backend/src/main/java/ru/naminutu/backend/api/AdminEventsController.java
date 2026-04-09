package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.AdminEventsApi;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;
import ru.naminutu.backend.service.AdminEventService;

@RestController
public class AdminEventsController implements AdminEventsApi {
	private final AdminEventService adminEventService;

	public AdminEventsController(AdminEventService adminEventService) {
		this.adminEventService = adminEventService;
	}

	@Override
	public ResponseEntity<EventDto> adminEventsCreate(String userId, CreateEventRequestDto createEventRequestDto) {
		return ApiResponseMapper.ok(adminEventService.createEvent(userId, createEventRequestDto));
	}

	@Override
	public ResponseEntity<Void> adminEventsDelete(String userId, String eventId) {
		return ApiResponseMapper.noContent(adminEventService.deleteEvent(userId, eventId));
	}

	@Override
	public ResponseEntity<EventListDto> adminEventsList(String userId) {
		return ApiResponseMapper.ok(adminEventService.listEvents(userId));
	}

	@Override
	public ResponseEntity<EventDto> adminEventsRead(String userId, String eventId) {
		return ApiResponseMapper.ok(adminEventService.readEvent(userId, eventId));
	}

	@Override
	public ResponseEntity<EventDto> adminEventsUpdate(String userId, String eventId, UpdateEventRequestDto updateEventRequestDto) {
		return ApiResponseMapper.ok(adminEventService.updateEvent(userId, eventId, updateEventRequestDto));
	}
}
