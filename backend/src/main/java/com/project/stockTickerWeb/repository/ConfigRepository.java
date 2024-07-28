package com.project.stockTickerWeb.repository;

import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfigRepository extends JpaRepository<Config, Integer> {

    List<Config> findAllByUserOrderByLastTouchedDesc(User user);
    void delete(Config config);
    Config findByUserIdAndCurrentTrue(int userId);
}
