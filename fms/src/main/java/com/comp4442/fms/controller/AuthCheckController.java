package com.comp4442.fms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthCheckController {

    @GetMapping("/api/auth/check")
    public String checkLogin() {
        return "LOGIN_OK";
    }
}
