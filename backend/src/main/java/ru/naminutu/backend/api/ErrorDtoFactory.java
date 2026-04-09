package ru.naminutu.backend.api;

import ru.naminutu.backend.generated.model.ErrorCodeDto;
import ru.naminutu.backend.generated.model.ErrorDto;

public final class ErrorDtoFactory {

	private ErrorDtoFactory() {
	}

	public static ErrorDto create(ErrorCodeDto code, String message) {
		return new ErrorDto(code, message);
	}
}
