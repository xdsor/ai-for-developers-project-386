package ru.naminutu.backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import ru.naminutu.backend.domain.EventRecord;
import ru.naminutu.backend.domain.HostRecord;
import ru.naminutu.backend.repository.MeetingBookingRepository;

@Configuration
@Profile("!test")
public class DemoDataInitializer {

	@Bean
	ApplicationRunner demoDataLoader(MeetingBookingRepository repository) {
		return ignored -> {
			repository.clear();

			var host = new HostRecord("demo-user", "Иван Иванов", "demo-user", "Europe/Moscow");
			var intro = new EventRecord(
				"15m",
				host.id(),
				"15 минут",
				"15-минутный звонок.",
				15,
				"15m"
			);
			var deepDive = new EventRecord(
				"30m",
				host.id(),
				"30 минут",
				"30-минутный звонок.",
				30,
				"30m"
			);

			repository.saveHost(host);
			repository.saveEvent(intro);
			repository.saveEvent(deepDive);
		};
	}
}
