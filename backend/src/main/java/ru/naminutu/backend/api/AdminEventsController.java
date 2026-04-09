package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.AdminEventsApi;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;
import ru.naminutu.backend.service.MeetingBookingService;

@RestController
public class AdminEventsController implements AdminEventsApi {
	private final MeetingBookingService service;

	public AdminEventsController(MeetingBookingService service) {
		this.service = service;
	}

	@Override
	public ResponseEntity<EventDto> adminEventsCreate(String userId, CreateEventRequestDto createEventRequestDto) {
		return ApiResponseMapper.ok(service.createAdminEvent(userId, createEventRequestDto));
	}

	@Override
	public ResponseEntity<Void> adminEventsDelete(String userId, String eventId) {
		return ApiResponseMapper.noContent(service.deleteAdminEvent(userId, eventId));
	}

	@Override
	public ResponseEntity<EventListDto> adminEventsList(String userId) {
		return ApiResponseMapper.ok(service.listAdminEvents(userId));
	}

	@Override
	public ResponseEntity<EventDto> adminEventsRead(String userId, String eventId) {
		return ApiResponseMapper.ok(service.readAdminEvent(userId, eventId));
	}

	@Override
	public ResponseEntity<EventDto> adminEventsUpdate(String userId, String eventId, UpdateEventRequestDto updateEventRequestDto) {
		return ApiResponseMapper.ok(service.updateAdminEvent(userId, eventId, updateEventRequestDto));
	}
}
