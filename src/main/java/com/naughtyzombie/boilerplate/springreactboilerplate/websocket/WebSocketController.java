package com.naughtyzombie.boilerplate.springreactboilerplate.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.text.DateFormat;
import java.util.Date;

@Controller
@Slf4j
public class WebSocketController {

    private final SimpMessagingTemplate template;

    @Autowired
    WebSocketController(SimpMessagingTemplate template){
        this.template = template;
    }

	@Scheduled(fixedRate = 5000)
    public void sendUpdate() {
		String formattedDate = DateFormat.getTimeInstance().format(new Date());
		log.debug("Sending Update {}", formattedDate);
		this.template.convertAndSend("/topic/update", formattedDate);
	}

	@MessageMapping("/hello")
	public String greeting(String message) throws Exception {
		log.info("Message received {}", message);
		return String.format("Hello %s ", message);
	}
}
