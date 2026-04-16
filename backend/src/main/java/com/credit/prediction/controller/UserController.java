package com.credit.prediction.controller;

import com.credit.prediction.model.User;
import com.credit.prediction.service.UserService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return service.login(request.getEmail(), request.getPassword());
    }

    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }
}