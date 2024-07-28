package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.Config;

import java.util.List;

public interface ConfigService {
    public Config saveConfig(Config config, int userId);
    public List<Config> getAllConfigs(int userId);
    public Config updateConfig(Config config, int userId);
    public Config deleteConfig(Config config, int userId);
}
