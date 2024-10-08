package com.project.stockTickerWeb.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.project.stockTickerWeb.model.Config;
import com.project.stockTickerWeb.model.User;
import com.project.stockTickerWeb.service.ConfigService;
import com.project.stockTickerWeb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private UserService userService;

    @Autowired
    private ConfigService configService;

    // Map of session ID to WebSocketSession
    private ConcurrentMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // Map of user ID to list of session IDs
    private ConcurrentMap<Integer, List<String>> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Extract the token from the query parameter
        String query = session.getUri().getQuery();
        String apiToken = query.split("=")[1];

        // Authenticate the user
        User user = userService.findByApiKey(apiToken);
        if (user == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid API Token"));
            return;
        }

        sessions.put(session.getId(), session);
        userSessions.computeIfAbsent(user.getId(), k -> new CopyOnWriteArrayList<>()).add(session.getId());

        // Send the current config (only specific fields)
        Config currentConfig = configService.getCurrentConfig(user.getId());
        if (currentConfig != null) {
            // Create a HashMap with only the desired fields
            Map<String, Object> configMap = new HashMap<>();
            configMap.put("type", "config");
            configMap.put("subs", currentConfig.getSubs());
            configMap.put("api_names", currentConfig.getApi_names());
            configMap.put("logo_names", currentConfig.getLogo_names());
            configMap.put("switch_time", currentConfig.getSwitch_time());
            configMap.put("id", currentConfig.getId());
            configMap.put("name", currentConfig.getName());

            // Convert the HashMap to a JSON string using Gson
            Gson gson = new Gson();
            String jsonString = gson.toJson(configMap);
            session.sendMessage(new TextMessage(jsonString));
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if necessary
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        sessions.remove(sessionId);

        // Remove the session ID from the userSessions map
        userSessions.forEach((userId, sessionIds) -> sessionIds.remove(sessionId));

        // Remove empty lists from the userSessions map
        userSessions.entrySet().removeIf(entry -> entry.getValue().isEmpty());
    }

    public void sendConfigUpdate(Config config) {
        Integer userId = config.getUserId();
        List<String> sessionIds = userSessions.get(userId);
        if (sessionIds != null) {
            sessionIds.forEach(sessionId -> {
                WebSocketSession session = sessions.get(sessionId);
                if (session != null) {
                    try {
                        // Create a HashMap with only the desired fields
                        Map<String, Object> configMap = new HashMap<>();
                        configMap.put("type", "config");
                        configMap.put("subs", config.getSubs());
                        configMap.put("api_names", config.getApi_names());
                        configMap.put("logo_names", config.getLogo_names());
                        configMap.put("switch_time", config.getSwitch_time());
                        configMap.put("id", config.getId());
                        configMap.put("name", config.getName());

                        // Convert the HashMap to a JSON string using Gson
                        Gson gson = new Gson();
                        String jsonString = gson.toJson(configMap);

                        session.sendMessage(new TextMessage(jsonString));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }
}
