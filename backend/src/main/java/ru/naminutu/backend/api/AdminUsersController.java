package ru.naminutu.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import ru.naminutu.backend.generated.api.AdminUsersApi;
import ru.naminutu.backend.generated.model.UserDto;
import ru.naminutu.backend.service.UserService;

@RestController
public class AdminUsersController implements AdminUsersApi {
	private final UserService userService;

	public AdminUsersController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public ResponseEntity<UserDto> adminUsersRead(String userId) {
		return ApiResponseMapper.ok(userService.readAdminUser(userId));
	}
}
