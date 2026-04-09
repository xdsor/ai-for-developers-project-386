package ru.naminutu.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.naminutu.backend.service.UserService;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserService userService;

	@BeforeEach
	void resetState() {
		userService.resetDemoData();
	}

	@Test
	void returnsPublicProfileFromGeneratedRoute() throws Exception {
		mockMvc.perform(get("/users/demo-user"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.user.id").value("demo-user"))
			.andExpect(jsonPath("$.events", hasSize(2)));
	}

	@Test
	void createsHostEventThroughGeneratedInterfaceImplementation() throws Exception {
		mockMvc.perform(post("/host/users/demo-user/events")
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
		var slotsResponse = mockMvc.perform(get("/users/demo-user/events/intro-call/slots"))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString();
		var firstStartAt = slotsResponse.split("\"startAt\":\"")[1].split("\"")[0];

		mockMvc.perform(post("/users/demo-user/events/intro-call/bookings")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
					{
					  "guest": {
					    "name": "Jane Doe",
					    "email": "jane@example.com"
					  },
					  "startAt": "%s"
					}
					""".formatted(firstStartAt)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.guest.email").value("jane@example.com"))
			.andExpect(jsonPath("$.eventId").value("event-intro"));
	}
}
