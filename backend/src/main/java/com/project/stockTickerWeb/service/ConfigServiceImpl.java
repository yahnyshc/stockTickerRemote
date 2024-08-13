package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.model.User;
import com.project.stockTickerWeb.repository.ConfigRepository;
import com.project.stockTickerWeb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        config.setUserId(userId);
        return configRepository.save(config);
    }

    @Override
    public List<Config> getAllConfigs(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return configRepository.findAllByUserIdOrderByLastTouchedDesc(userId);
    }

    public Config updateConfig(Config config, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Config existingConfig = configRepository.findById(config.getId())
                .orElseThrow(() -> new RuntimeException("Config not found"));

        if (existingConfig.getUserId() != userId) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        config.setUserId(userId);
        return configRepository.save(config);
    }

    public Config deleteConfig(Config config, int userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Config existingConfig = configRepository.findById(config.getId())
                .orElseThrow(() -> new RuntimeException("Config not found"));

        if (existingConfig.getUserId() != userId) {
            throw new RuntimeException("Unauthorized delete attempt");
        }

        config.setUserId(userId);
        configRepository.delete(existingConfig);
        return config;
    }

    public Config getCurrentConfig(int userId){
        Config config = configRepository.findByUserIdAndCurrentTrue(userId);
        if (config != null){
            System.out.println("Found the config "+config.getId());
        }
        else{
            System.out.println("Config not found");
        }
        return config;
    }

    public Config getConfigById(int configId){
        Optional<Config> c = configRepository.findById(configId);
        return c.orElse(null);
    }
}
