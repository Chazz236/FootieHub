-- create database and use
CREATE DATABASE IF NOT EXISTS footiehub;
USE footiehub;

-- players table
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `value` bigint NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `joinedAt` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- matches table
CREATE TABLE `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `home_score` int NOT NULL,
  `away_score` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- goal contributions table
CREATE TABLE `goal_contributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `goal_scorer_id` int DEFAULT NULL,
  `assist_player_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `match_id` (`match_id`),
  KEY `goal_scorer_id` (`goal_scorer_id`),
  KEY `assist_maker_id` (`assist_player_id`),
  CONSTRAINT `goal_contributions_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`),
  CONSTRAINT `goal_contributions_ibfk_2` FOREIGN KEY (`goal_scorer_id`) REFERENCES `players` (`id`),
  CONSTRAINT `goal_contributions_ibfk_3` FOREIGN KEY (`assist_player_id`) REFERENCES `players` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- player performance table
CREATE TABLE `player_performance` (
  `player_id` int NOT NULL,
  `match_id` int NOT NULL,
  `team` enum('home','away') NOT NULL,
  `goals` int NOT NULL DEFAULT '0',
  `assists` int NOT NULL DEFAULT '0',
  `value_change` bigint NOT NULL,
  PRIMARY KEY (`player_id`,`match_id`),
  KEY `match_id` (`match_id`),
  CONSTRAINT `player_performance_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`),
  CONSTRAINT `player_performance_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
