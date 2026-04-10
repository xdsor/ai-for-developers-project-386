package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.HostEventsApi;
import ru.naminutu.backend.generated.model.CreateEventRequestDto;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.EventListDto;
import ru.naminutu.backend.generated.model.UpdateEventRequestDto;
import ru.naminutu.backend.service.HostEventService;

@RestController
public class HostEventsController implements HostEventsApi {
	private final HostEventService hostEventService;

	public HostEventsController(HostEventService hostEventService) {
		this.hostEventService = hostEventService;
	}

	@Override
	public ResponseEntity<EventDto> hostEventsCreate(String hostId, CreateEventRequestDto createEventRequestDto) {
		return ApiResponseMapper.ok(hostEventService.createEvent(hostId, createEventRequestDto));
	}

	@Override
	public ResponseEntity<Void> hostEventsDelete(String hostId, String eventId) {
		return ApiResponseMapper.noContent(hostEventService.deleteEvent(hostId, eventId));
	}

	@Override
	public ResponseEntity<EventListDto> hostEventsList(String hostId) {
		return ApiResponseMapper.ok(hostEventService.listEvents(hostId));
	}

	@Override
	public ResponseEntity<EventDto> hostEventsRead(String hostId, String eventId) {
		return ApiResponseMapper.ok(hostEventService.readEvent(hostId, eventId));
	}

	@Override
	public ResponseEntity<EventDto> hostEventsUpdate(String hostId, String eventId, UpdateEventRequestDto updateEventRequestDto) {
		return ApiResponseMapper.ok(hostEventService.updateEvent(hostId, eventId, updateEventRequestDto));
	}
}
