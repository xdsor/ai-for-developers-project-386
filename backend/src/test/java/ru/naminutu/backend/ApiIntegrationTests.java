package ru.naminutu.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import ru.naminutu.backend.service.HostService;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private HostService hostService;

	@BeforeEach
	void resetState() {
		hostService.resetDemoData();
	}

	@Test
	void returnsPublicProfileFromGeneratedRoute() throws Exception {
		mockMvc.perform(get("/hosts/demo-user"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.host.id").value("demo-user"))
			.andExpect(jsonPath("$.events", hasSize(2)));
	}

	@Test
	void createsHostEventThroughGeneratedInterfaceImplementation() throws Exception {
		mockMvc.perform(post("/host/demo-user/events")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "title": "Architecture review",
					  "description": "Review TypeSpec integration",
					  "durationMinutes": 30,
					  "slug": "architecture-review"
					}
					"""))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.ownerId").value("demo-user"))
			.andExpect(jsonPath("$.slug").value("architecture-review"));
	}

	@Test
	void createsBookingUsingAvailableSlot() throws Exception {
		var firstStartAt = firstSlotStartAt("/hosts/demo-user/events/intro-call/slots");

		mockMvc.perform(createBookingRequest("/hosts/demo-user/events/intro-call/bookings", firstStartAt))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.guest.email").value("jane@example.com"))
			.andExpect(jsonPath("$.eventId").value("event-intro"));
	}

	@Test
	void rejectsOverlappingBookingWithConflictStatus() throws Exception {
		var deepDiveStartAt = firstSlotStartAt("/hosts/demo-user/events/deep-dive/slots");
		var overlappingIntroStartAt = OffsetDateTime.parse(deepDiveStartAt)
			.plusMinutes(15)
			.toString();

		mockMvc.perform(createBookingRequest("/hosts/demo-user/events/deep-dive/bookings", deepDiveStartAt))
			.andExpect(status().isOk());

		mockMvc.perform(createBookingRequest("/hosts/demo-user/events/intro-call/bookings", overlappingIntroStartAt))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.code").value("SlotUnavailable"));
	}

	@Test
	void hidesOverlappingSlotsFromSlotsEndpoint() throws Exception {
		var deepDiveStartAt = firstSlotStartAt("/hosts/demo-user/events/deep-dive/slots");
		var overlappingIntroStartAt = OffsetDateTime.parse(deepDiveStartAt)
			.plusMinutes(15)
			.toString();

		mockMvc.perform(createBookingRequest("/hosts/demo-user/events/deep-dive/bookings", deepDiveStartAt))
			.andExpect(status().isOk());

		mockMvc.perform(get("/hosts/demo-user/events/intro-call/slots"))
			.andExpect(status().isOk())
			.andExpect(content().string(not(containsString("\"startAt\":\"" + overlappingIntroStartAt + "\""))));
	}

	private String firstSlotStartAt(String path) throws Exception {
		var slotsResponse = mockMvc.perform(get(path))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();
		return slotsResponse.split("\"startAt\":\"")[1].split("\"")[0];
	}

	private MockHttpServletRequestBuilder createBookingRequest(String path, String startAt) {
		return post(path)
			.contentType(MediaType.APPLICATION_JSON)
			.content("""
				{
				  "guest": {
				    "name": "Jane Doe",
				    "email": "jane@example.com"
				  },
				  "startAt": "%s"
				}
				""".formatted(startAt));
	}
}
