package com.comp4442.fms.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ Allow frontend static files
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/dashboard.html",
                    "/style.css",
                    "/script.js",
                    "/favicon.ico"
                ).permitAll()

                // ✅ Allow ONLY registration (NOT login check)
                .requestMatchers("/api/auth/register").permitAll()

                // ❌ DO NOT permit /api/auth/check
                // ✅ It must be authenticated

                // ✅ Everything else requires login
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
