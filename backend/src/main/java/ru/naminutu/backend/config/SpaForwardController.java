package ru.naminutu.backend.config;

import java.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

	@GetMapping({
		"/{path:[^.]*}",
		"/**/{path:[^.]*}"
	})
	public String forward(HttpServletRequest request, HttpServletResponse response) throws IOException {
		var requestUri = request.getRequestURI();
		if (requestUri.startsWith("/api/") || "/api".equals(requestUri)) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		return "forward:/index.html";
	}
}
