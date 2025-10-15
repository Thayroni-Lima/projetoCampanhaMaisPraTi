package com.projeto.campanhas.backend.config;

import com.projeto.campanhas.backend.domain.entity.UserType;
import com.projeto.campanhas.backend.domain.repository.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserTypeRepository userTypeRepository;

    @Override
    public void run(String... args) {
        if (userTypeRepository.findByLabel("ADMIN").isEmpty()) {
            userTypeRepository.save(UserType.builder().label("ADMIN").build());
        }
        if (userTypeRepository.findByLabel("NORMAL").isEmpty()) {
            userTypeRepository.save(UserType.builder().label("NORMAL").build());
        }
    }
}
