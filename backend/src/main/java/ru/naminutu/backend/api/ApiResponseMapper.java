package ru.naminutu.backend.api;

import io.vavr.control.Either;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.naminutu.backend.generated.model.ErrorCodeDto;
import ru.naminutu.backend.generated.model.ErrorDto;

public final class ApiResponseMapper {

	private ApiResponseMapper() {
	}

	@SuppressWarnings("unchecked")
	public static <T> ResponseEntity<T> ok(Either<DomainError, T> result) {
		return result.fold(error -> (ResponseEntity<T>) error(error), ResponseEntity::ok);
	}

	public static ResponseEntity<Void> noContent(Either<DomainError, Void> result) {
		return result.fold(ApiResponseMapper::errorWithoutBody, ignored -> ResponseEntity.noContent().build());
	}

	public static ResponseEntity<ErrorDto> error(DomainError error) {
		return ResponseEntity.status(statusOf(error))
			.body(ErrorDtoFactory.create(errorCodeOf(error), error.message()));
	}

	private static ResponseEntity<Void> errorWithoutBody(DomainError error) {
		return ResponseEntity.status(statusOf(error)).build();
	}

	private static HttpStatus statusOf(DomainError error) {
		return switch (error) {
			case DomainError.NotFound ignored -> HttpStatus.NOT_FOUND;
			case DomainError.ValidationFailed ignored -> HttpStatus.BAD_REQUEST;
			case DomainError.SlotUnavailable ignored -> HttpStatus.CONFLICT;
			case DomainError.SlotOutsideBookingWindow ignored -> HttpStatus.CONFLICT;
			case DomainError.SlugAlreadyExists ignored -> HttpStatus.CONFLICT;
		};
	}

	private static ErrorCodeDto errorCodeOf(DomainError error) {
		return switch (error) {
			case DomainError.NotFound ignored -> ErrorCodeDto.NOT_FOUND;
			case DomainError.ValidationFailed ignored -> ErrorCodeDto.VALIDATION_FAILED;
			case DomainError.SlotUnavailable ignored -> ErrorCodeDto.SLOT_UNAVAILABLE;
			case DomainError.SlotOutsideBookingWindow ignored -> ErrorCodeDto.SLOT_OUTSIDE_BOOKING_WINDOW;
			case DomainError.SlugAlreadyExists ignored -> ErrorCodeDto.SLUG_ALREADY_EXISTS;
		};
	}
}
