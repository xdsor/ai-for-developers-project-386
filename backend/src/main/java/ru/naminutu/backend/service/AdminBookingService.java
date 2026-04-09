package ru.naminutu.backend.service;

import io.vavr.control.Either;
import java.util.Comparator;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.BookingRecord;
import ru.naminutu.backend.generated.model.BookingListDto;
import ru.naminutu.backend.mapper.BookingDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class AdminBookingService {
	private final UserService userService;
	private final MeetingBookingRepository repository;

	public AdminBookingService(UserService userService, MeetingBookingRepository repository) {
		this.userService = userService;
		this.repository = repository;
	}

	public Either<DomainError, BookingListDto> listBookings(String userId) {
		return userService.findUserById(userId)
			.map(user -> repository.listBookings()
				.filter(booking -> booking.ownerId().equals(user.id()))
				.sorted(Comparator.comparing(BookingRecord::startAt))
				.map(BookingDtoMapper::toDto)
				.asJava())
			.map(BookingDtoMapper::toListDto);
	}
}
