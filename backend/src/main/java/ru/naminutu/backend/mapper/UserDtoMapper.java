package ru.naminutu.backend.mapper;

import ru.naminutu.backend.domain.UserRecord;
import ru.naminutu.backend.generated.model.UserDto;

public final class UserDtoMapper {
	private UserDtoMapper() {
	}

	public static UserDto toDto(UserRecord user) {
		return new UserDto(user.id(), user.name(), user.slug(), user.timeZone());
	}
}
