package com.project.stockTickerWeb.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Config {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private List<String> subs;
    private List<String> api_names;
    private List<String> logo_names;
    private boolean current;

    @Column(name = "last_touched")
    private LocalDateTime lastTouched;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastTouched = LocalDateTime.now();
    }

    public Config(){
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSubs() {
        return subs;
    }

    public void setSubs(List<String> subs) {
        this.subs = subs;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) { this.current = current; }

    public LocalDateTime getLastTouched() {
        return lastTouched;
    }

    public void setLastTouched(LocalDateTime lastTouched) {
        this.lastTouched = lastTouched;
    }

    public List<String> getApi_names() {
        return api_names;
    }

    public void setApi_names(List<String> api_names) {
        this.api_names = api_names;
    }

    public List<String> getLogo_names() {
        return logo_names;
    }

    public void setLogo_names(List<String> logo_names) {
        this.logo_names = logo_names;
    }
}
