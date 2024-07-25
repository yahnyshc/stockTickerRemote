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
    public Config add(@RequestBody Config config){
        return configService.saveConfig(config);
    }

    @CrossOrigin
    @PatchMapping("/edit")
    public Config edit(@RequestBody Config config){
        return configService.updateConfig(config);
    }

    @CrossOrigin
    @GetMapping("/getAll")
    public List<Config> getAllConfigs(){
        return configService.getAllConfigs();
    }

}
