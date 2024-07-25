package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.repository.ConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Vector;

@Service
public class ConfigServiceImpl implements ConfigService{

    @Autowired
    private ConfigRepository configRepository;

    @Override
    public Config saveConfig(Config config) {
        return configRepository.save(config);
    }

    @Override
    public List<Config> getAllConfigs() {
        return configRepository.findAll();
    }

    public Config updateConfig(Config config) { return configRepository.save(config); }
}
