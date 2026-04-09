package ru.naminutu.backend.mapper;

import java.util.List;
import ru.naminutu.backend.generated.model.EventDto;
import ru.naminutu.backend.generated.model.UserDto;
import ru.naminutu.backend.generated.model.UserProfileDto;

public final class UserProfileDtoMapper {
	private UserProfileDtoMapper() {
	}

	public static UserProfileDto toDto(UserDto user, List<EventDto> events) {
		return new UserProfileDto(user, events);
	}
}
