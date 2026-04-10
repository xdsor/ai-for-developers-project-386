package ru.naminutu.backend.lib;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;

class TimeIntervalTest {

	@Test
	void detectsPartialOverlap() {
		var left = interval("2026-04-10T04:45:00Z", "2026-04-10T05:30:00Z");
		var right = interval("2026-04-10T05:00:00Z", "2026-04-10T05:15:00Z");

		assertTrue(left.overlaps(right));
		assertTrue(right.overlaps(left));
	}

	@Test
	void detectsNestedOverlap() {
		var outer = interval("2026-04-10T04:45:00Z", "2026-04-10T05:30:00Z");
		var inner = interval("2026-04-10T04:50:00Z", "2026-04-10T05:10:00Z");

		assertTrue(outer.overlaps(inner));
		assertTrue(inner.overlaps(outer));
	}

	@Test
	void separatesTouchingIntervalsFromOverlap() {
		var left = interval("2026-04-10T04:00:00Z", "2026-04-10T04:45:00Z");
		var right = interval("2026-04-10T04:45:00Z", "2026-04-10T05:30:00Z");

		assertFalse(left.overlaps(right));
		assertFalse(right.overlaps(left));
		assertTrue(left.touches(right));
		assertTrue(right.touches(left));
	}

	@Test
	void detectsDisjointIntervals() {
		var left = interval("2026-04-10T04:00:00Z", "2026-04-10T04:45:00Z");
		var right = interval("2026-04-10T05:00:00Z", "2026-04-10T05:15:00Z");

		assertFalse(left.overlaps(right));
		assertFalse(left.touches(right));
	}

	@Test
	void containsStartButNotEndInHalfOpenInterval() {
		var interval = interval("2026-04-10T04:45:00Z", "2026-04-10T05:30:00Z");

		assertTrue(interval.contains(OffsetDateTime.parse("2026-04-10T04:45:00Z")));
		assertTrue(interval.contains(OffsetDateTime.parse("2026-04-10T05:00:00Z")));
		assertFalse(interval.contains(OffsetDateTime.parse("2026-04-10T05:30:00Z")));
	}

	@Test
	void rejectsInvalidBounds() {
		assertThrows(
			IllegalArgumentException.class,
			() -> interval("2026-04-10T05:30:00Z", "2026-04-10T05:30:00Z")
		);
		assertThrows(
			IllegalArgumentException.class,
			() -> interval("2026-04-10T05:30:00Z", "2026-04-10T04:45:00Z")
		);
	}

	private static TimeInterval interval(String start, String end) {
		return new TimeInterval(OffsetDateTime.parse(start), OffsetDateTime.parse(end));
	}
}
