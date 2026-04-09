package ru.naminutu.backend.api;

public sealed interface DomainError permits DomainError.NotFound,
	DomainError.ValidationFailed,
	DomainError.SlotUnavailable,
	DomainError.SlotOutsideBookingWindow,
	DomainError.SlugAlreadyExists {

	String message();

	record NotFound(String message) implements DomainError {
	}

	record ValidationFailed(String message) implements DomainError {
	}

	record SlotUnavailable(String message) implements DomainError {
	}

	record SlotOutsideBookingWindow(String message) implements DomainError {
	}

	record SlugAlreadyExists(String message) implements DomainError {
	}
}
