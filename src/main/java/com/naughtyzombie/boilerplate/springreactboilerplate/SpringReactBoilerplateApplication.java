package com.naughtyzombie.boilerplate.springreactboilerplate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringReactBoilerplateApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringReactBoilerplateApplication.class, args);
	}
}
