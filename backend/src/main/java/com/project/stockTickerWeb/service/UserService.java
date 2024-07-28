package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.User;

import java.util.Map;
import java.util.Optional;

public interface UserService {
    Map<String, String> login(String username, String password) throws Exception;
    Map<String, String> signup(String username, String password) throws Exception;
    public Optional<User> findById(int userId);
}
