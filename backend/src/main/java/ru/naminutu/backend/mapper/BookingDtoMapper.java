package ru.naminutu.backend.mapper;

import java.util.List;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.generated.model.BookingDto;
import ru.naminutu.backend.generated.model.BookingListDto;

public final class BookingDtoMapper {
	private BookingDtoMapper() {
	}

	public static BookingDto toDto(BookingRecord booking) {
		return new BookingDto(
			booking.id(),
			booking.eventId(),
			booking.ownerId(),
			GuestContactDtoMapper.toDto(booking.guest()),
			booking.startAt(),
			booking.endAt(),
			booking.createdAt()
		);
	}

	public static BookingListDto toListDto(List<BookingDto> bookings) {
		return new BookingListDto(bookings);
	}
}
