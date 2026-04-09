package ru.naminutu.backend.api;

import org.springframework.http.HttpStatus;
import ru.naminutu.backend.generated.model.ErrorCodeDto;

public class ApiException extends RuntimeException {
	private final HttpStatus status;
	private final ErrorCodeDto code;

	public ApiException(HttpStatus status, ErrorCodeDto code, String message) {
		super(message);
		this.status = status;
		this.code = code;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public ErrorCodeDto getCode() {
		return code;
	}
}
