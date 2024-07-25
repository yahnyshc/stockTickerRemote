package com.project.stockTickerWeb.service;

import com.project.stockTickerWeb.model.Config;

import java.util.List;

public interface ConfigService {
    public Config saveConfig(Config config);
    public List<Config> getAllConfigs();
    public Config updateConfig(Config config);
}
