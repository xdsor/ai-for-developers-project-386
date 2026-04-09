package ru.naminutu.backend.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.naminutu.backend.generated.model.ErrorCodeDto;
import ru.naminutu.backend.generated.model.ErrorDto;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorDto> handleValidationException(MethodArgumentNotValidException exception) {
		var fieldError = exception.getBindingResult().getFieldError();
		var message = fieldError == null ? "Validation failed." : fieldError.getField() + ": " + fieldError.getDefaultMessage();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(ErrorDtoFactory.create(ErrorCodeDto.VALIDATION_FAILED, message));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorDto> handleUnexpectedException(Exception exception) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ErrorDtoFactory.create(ErrorCodeDto.VALIDATION_FAILED, "Unexpected server error."));
	}
}
