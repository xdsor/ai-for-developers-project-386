package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.HostUsersApi;
import ru.naminutu.backend.generated.model.UserDto;
import ru.naminutu.backend.service.UserService;

@RestController
public class HostUsersController implements HostUsersApi {
	private final UserService userService;

	public HostUsersController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public ResponseEntity<UserDto> hostUsersRead(String userId) {
		return ApiResponseMapper.ok(userService.readHostUser(userId));
	}
}
