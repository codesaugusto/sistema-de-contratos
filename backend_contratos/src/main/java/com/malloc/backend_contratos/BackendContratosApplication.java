package com.malloc.backend_contratos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendContratosApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendContratosApplication.class, args);
	}

}