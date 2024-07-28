package com.project.stockTickerWeb.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;

@Configuration
public class DotenvConfig {

    @Bean
    public static BeanFactoryPostProcessor dotenvConfigurer() {
        return beanFactory -> {
            ConfigurableEnvironment env = beanFactory.getBean(ConfigurableEnvironment.class);
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            dotenv.entries().forEach(entry -> {
                env.getSystemProperties().put(entry.getKey(), entry.getValue());
            });
        };
    }
}
