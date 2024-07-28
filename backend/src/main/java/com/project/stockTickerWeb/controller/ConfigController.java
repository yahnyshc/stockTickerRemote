package com.project.stockTickerWeb.controller;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config")
public class ConfigController {
    @Autowired
    private ConfigService configService;

    @CrossOrigin
    @PostMapping("/add")
    public Config add(@RequestBody Config config, @RequestParam int userId){
        return configService.saveConfig(config, userId);
    }

    @CrossOrigin
    @PatchMapping("/edit")
    public Config edit(@RequestBody Config config, @RequestParam int userId){
        return configService.updateConfig(config, userId);
    }

    @CrossOrigin
    @DeleteMapping("/delete")
    public Config delete(@RequestBody Config config, @RequestParam int userId){
        return configService.deleteConfig(config, userId);
    }

    @CrossOrigin
    @GetMapping("/getAll")
    public List<Config> getAllConfigs(@RequestParam int userId){
        return configService.getAllConfigs(userId);
    }

}
