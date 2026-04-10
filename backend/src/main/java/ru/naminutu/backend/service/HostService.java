package ru.naminutu.backend.service;

import io.vavr.control.Either;
import org.springframework.stereotype.Service;
import ru.naminutu.backend.api.DomainError;
import ru.naminutu.backend.domain.DomainErrors;
import ru.naminutu.backend.domain.HostRecord;
import ru.naminutu.backend.generated.model.HostDto;
import ru.naminutu.backend.mapper.HostDtoMapper;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Service
public class HostService {
	private final MeetingBookingRepository repository;

	public HostService(MeetingBookingRepository repository) {
		this.repository = repository;
	}

	public Either<DomainError, HostDto> readHost(String hostId) {
		return findHostById(hostId).map(HostDtoMapper::toDto);
	}

	Either<DomainError, HostRecord> findHostById(String hostId) {
		return repository.findHostById(hostId)
			.toEither(DomainErrors.notFound("Host not found."));
	}

	Either<DomainError, HostRecord> findHostBySlug(String hostSlug) {
		return repository.findHostBySlug(hostSlug)
			.toEither(DomainErrors.notFound("Host not found."));
	}
}
