package ru.naminutu.backend.domain;

import ru.naminutu.backend.api.DomainError;

public final class DomainErrors {

	private DomainErrors() {
	}

	public static DomainError notFound(String message) {
		return new DomainError.NotFound(message);
	}

	public static DomainError validationFailed(String message) {
		return new DomainError.ValidationFailed(message);
	}

	public static DomainError slotUnavailable(String message) {
		return new DomainError.SlotUnavailable(message);
	}

	public static DomainError slotOutsideBookingWindow(String message) {
		return new DomainError.SlotOutsideBookingWindow(message);
	}

	public static DomainError slugAlreadyExists(String message) {
		return new DomainError.SlugAlreadyExists(message);
	}
}
