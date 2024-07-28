package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.User;
import com.project.stockTickerWeb.repository.UserRepository;
import com.project.stockTickerWeb.util.JwtUtil;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtil util;

    @Override
    public Map<String, String> login(String username, String password) throws Exception {
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new Exception("All fields must be filled");
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new Exception("Unknown username");
        }

        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Incorrect password");
        }

        // Generate token
        String token = util.createToken(String.valueOf(user.getId()));

        // Prepare the response map
        Map<String, String> response = new HashMap<>();
        response.put("id", String.valueOf(user.getId()));
        response.put("username", user.getUsername());
        response.put("token", token);

        return response;
    }

    @Override
    public Map<String, String> signup(String username, String password) throws Exception {
        // Validation
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new ValidationException("All fields must be filled");
        }

        if (!isStrongPassword(password)) {
            throw new ValidationException("Password not strong enough");
        }

        // Check if username is already in use
        if (userRepository.findByUsername(username) != null) {
            throw new ValidationException("Username already in use");
        }

        // Password hashing
        String hashedPassword = bCryptPasswordEncoder.encode(password);

        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);
        user.setApiKey(generateUniqueApiKey());

        userRepository.save(user);

        // Generate token
        String token = util.createToken(String.valueOf(user.getId()));

        // Prepare the response map
        Map<String, String> response = new HashMap<>();
        response.put("id", String.valueOf(user.getId()));
        response.put("username", user.getUsername());
        response.put("token", token);

        return response;
    }

    @Override
    public Optional<User> findById(int userId) {
        return userRepository.findById(userId);
    }

    private boolean isStrongPassword(String password) {
        return password.length() >= 6 &&
                password.chars().anyMatch(Character::isUpperCase) &&
                password.chars().anyMatch(Character::isLowerCase) &&
                password.chars().anyMatch(Character::isDigit) &&
                password.chars().anyMatch(ch -> "!@#$%^&*()_+[]{}|;:,.<>?".indexOf(ch) >= 0);
    }

    private String generateUniqueApiKey() {
        String apiKey;
        do {
            apiKey = User.generateApiKey();
        } while (userRepository.existsByApiKey(apiKey));
        return apiKey;
    }

    public String getApiKey(int userId) {
        Optional<User> u = userRepository.findById(userId);
        if (u.isPresent()){
            return u.get().getApiKey();
        }
        else{
            throw new RuntimeException("User doesn't exist");
        }
    }

    public String regenerateApiKey(int userId) {
        Optional<User> u = userRepository.findById(userId);
        if (u.isPresent()){
            User user = u.get();
            user.setApiKey(generateUniqueApiKey());
            userRepository.save(user);
            return user.getApiKey();
        }
        else{
            throw new RuntimeException("User doesn't exist");
        }
    }

    public void delete(int userId){
        userRepository.deleteById(userId);
    }

    public User findByApiKey(String apiKey){
        return userRepository.findByApiKey(apiKey);
    }
}
