package com.project.stockTickerWeb.repository;

import com.project.stockTickerWeb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    boolean existsByApiKey(String apiKey);
    User findByApiKey(String apiKey);
}
