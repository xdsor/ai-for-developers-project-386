package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.HostAccountApi;
import ru.naminutu.backend.generated.model.HostDto;
import ru.naminutu.backend.service.HostService;

@RestController
public class HostAccountController implements HostAccountApi {
	private final HostService hostService;

	public HostAccountController(HostService hostService) {
		this.hostService = hostService;
	}

	@Override
	public ResponseEntity<HostDto> hostAccountRead(String hostId) {
		return ApiResponseMapper.ok(hostService.readHost(hostId));
	}
}
