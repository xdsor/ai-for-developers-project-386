package ru.naminutu.backend.lib;

import java.time.Instant;
import java.time.OffsetDateTime;

public record TimeInterval(
	OffsetDateTime start,
	OffsetDateTime end
) {
	public TimeInterval {
		if (start == null || end == null) {
			throw new IllegalArgumentException("Interval bounds are required.");
		}
		if (!toInstant(start).isBefore(toInstant(end))) {
			throw new IllegalArgumentException("Interval start must be before end.");
		}
	}

	public boolean overlaps(TimeInterval other) {
		return toInstant(start).isBefore(toInstant(other.end()))
			&& toInstant(end).isAfter(toInstant(other.start()));
	}

	public boolean touches(TimeInterval other) {
		return toInstant(end).equals(toInstant(other.start()))
			|| toInstant(start).equals(toInstant(other.end()));
	}

	public boolean contains(OffsetDateTime point) {
		var instant = toInstant(point);
		return !instant.isBefore(toInstant(start))
			&& instant.isBefore(toInstant(end));
	}

	private static Instant toInstant(OffsetDateTime value) {
		return value.toInstant();
	}
}
