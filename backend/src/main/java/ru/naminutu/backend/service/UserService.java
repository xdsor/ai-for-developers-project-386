package ru.naminutu.backend.service;

import io.vavr.control.Either;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.UserRecord;
import ru.naminutu.backend.generated.model.UserDto;
import ru.naminutu.backend.mapper.UserDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class UserService {
	private final MeetingBookingRepository repository;

	public UserService(MeetingBookingRepository repository) {
		this.repository = repository;
	}

	public void resetDemoData() {
		repository.resetDemoData();
	}

	public Either<DomainError, UserDto> readHostUser(String userId) {
		return findUserById(userId).map(UserDtoMapper::toDto);
	}

	Either<DomainError, UserRecord> findUserById(String userId) {
		return repository.findUserById(userId)
			.toEither(DomainErrors.notFound("User not found."));
	}

	Either<DomainError, UserRecord> findUserBySlug(String userSlug) {
		return repository.findUserBySlug(userSlug)
			.toEither(DomainErrors.notFound("User not found."));
	}
}
