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
public class HostBookingService {
	private final HostService hostService;
	private final MeetingBookingRepository repository;

	public HostBookingService(HostService hostService, MeetingBookingRepository repository) {
		this.hostService = hostService;
		this.repository = repository;
	}

	public Either<DomainError, BookingListDto> listBookings(String hostId) {
		return hostService.findHostById(hostId)
			.map(host -> repository.listBookingsByOwnerId(host.id())
				.sorted(Comparator.comparing(BookingRecord::startAt))
				.map(BookingDtoMapper::toDto)
				.asJava())
			.map(BookingDtoMapper::toListDto);
	}
}
