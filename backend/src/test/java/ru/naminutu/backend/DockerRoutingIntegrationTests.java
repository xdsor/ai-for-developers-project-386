package ru.naminutu.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.HostRecord;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({ "test", "docker" })
class DockerRoutingIntegrationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private MeetingBookingRepository repository;

	@BeforeEach
	void resetState() {
		repository.clear();
		repository.saveHost(new HostRecord("demo-user", "Demo User", "demo-user", "Europe/Berlin"));
		repository.saveEvent(new EventRecord(
			"event-intro",
			"demo-user",
			"Intro call",
			"15-minute intro to align on the task.",
			15,
			"intro-call"
		));
		repository.saveEvent(new EventRecord(
			"event-deep-dive",
			"demo-user",
			"Deep dive",
			"45-minute working session for implementation details.",
			45,
			"deep-dive"
		));
	}

	@Test
	void servesApiUnderDockerPrefix() throws Exception {
		mockMvc.perform(get("/api/hosts/demo-user"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.host.id").value("demo-user"))
			.andExpect(jsonPath("$.events", hasSize(2)));
	}

	@Test
	void forwardsHostDashboardRouteToSpa() throws Exception {
		mockMvc.perform(get("/host"))
			.andExpect(status().isOk())
			.andExpect(forwardedUrl("/index.html"));
	}

	@Test
	void forwardsGuestEventRouteToSpa() throws Exception {
		mockMvc.perform(get("/hosts/demo-user/events/intro-call"))
			.andExpect(status().isOk())
			.andExpect(forwardedUrl("/index.html"));
	}

	@Test
	void keepsUnknownApiRoutesOutOfSpaFallback() throws Exception {
		mockMvc.perform(get("/api/unknown"))
			.andExpect(status().isNotFound());
	}
}
