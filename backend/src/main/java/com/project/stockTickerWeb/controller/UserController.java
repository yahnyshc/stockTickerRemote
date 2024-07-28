package com.project.stockTickerWeb.controller;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.model.User;
import com.project.stockTickerWeb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Map<String, String> response = userService.login(user.getUsername(), user.getPassword());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @CrossOrigin
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            Map<String, String> response = userService.signup(user.getUsername(), user.getPassword());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @CrossOrigin
    @GetMapping("/apikey")
    public Map<String, String> apikey(@RequestParam int userId){
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", userService.getApiKey(userId));
        return response;
    }

    @CrossOrigin
    @GetMapping("/regenerate/apikey")
    public Map<String, String> regenerate_apikey(@RequestParam int userId){
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", userService.regenerateApiKey(userId));
        return response;
    }

    @CrossOrigin
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam int userId){
        userService.delete(userId);
        return ResponseEntity.ok().body(null);
    }


}
