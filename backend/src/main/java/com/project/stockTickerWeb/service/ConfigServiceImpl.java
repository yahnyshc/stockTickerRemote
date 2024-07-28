package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.model.User;
import com.project.stockTickerWeb.repository.ConfigRepository;
import com.project.stockTickerWeb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigServiceImpl implements ConfigService{

    @Autowired
    private ConfigRepository configRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Config saveConfig(Config config, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        config.setUser(user);
        return configRepository.save(config);
    }

    @Override
    public List<Config> getAllConfigs(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return configRepository.findAllByUserOrderByLastTouchedDesc(user);
    }

    public Config updateConfig(Config config, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Config existingConfig = configRepository.findById(config.getId())
                .orElseThrow(() -> new RuntimeException("Config not found"));

        if (existingConfig.getUser().getId() != userId) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        config.setUser(user);
        return configRepository.save(config);
    }

    public Config deleteConfig(Config config, int userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Config existingConfig = configRepository.findById(config.getId())
                .orElseThrow(() -> new RuntimeException("Config not found"));

        if (existingConfig.getUser().getId() != userId) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        config.setUser(user);
        configRepository.delete(existingConfig);
        return config;
    }
}
