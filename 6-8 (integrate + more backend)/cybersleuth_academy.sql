-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2025 at 08:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cybersleuth_academy`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `points` int(11) DEFAULT 0,
  `rooms_completed` int(11) DEFAULT 0,
  `country` varchar(10) DEFAULT 'SG',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `hashed_password`, `points`, `rooms_completed`, `country`, `created_at`, `reset_token`, `reset_token_expires`) VALUES
(1, 'Jianfeng', 'swapprojectsender@gmail.com', '$2y$10$Fq1wjxauy5iS0B.WfSWp5eVBkMzkUvRpIB//V6vvztnt/VVhi3oni', 199, 2, 'SG', '2025-08-05 07:01:10', NULL, NULL),
(2, 'Huixin', 'huixin@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 199, 2, 'US', '2025-08-05 07:01:10', NULL, NULL),
(3, 'Britney', 'britney@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 198, 2, 'UK', '2025-08-05 07:01:10', NULL, NULL),
(4, 'Muqaddim', 'muqaddim@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 192, 2, 'SG', '2025-08-05 07:01:10', NULL, NULL),
(5, 'Alice', 'alice@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 190, 2, 'SG', '2025-08-06 02:30:53', NULL, NULL),
(6, 'Bob', 'bob@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 189, 2, 'UK', '2025-08-06 02:30:53', NULL, NULL),
(7, 'Charlie', 'charlie@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 188, 2, 'US', '2025-08-06 02:30:53', NULL, NULL),
(8, 'Diana', 'diana@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 187, 2, 'SG', '2025-08-06 02:30:53', NULL, NULL),
(9, 'Eve', 'eve@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 186, 2, 'UK', '2025-08-06 02:30:53', NULL, NULL),
(10, 'Frank', 'frank@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 185, 2, 'US', '2025-08-06 02:30:53', NULL, NULL),
(11, 'Grace', 'grace@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 184, 2, 'SG', '2025-08-06 02:30:53', NULL, NULL),
(12, 'Henry', 'henry@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 183, 2, 'UK', '2025-08-06 02:30:53', NULL, NULL),
(13, 'Ivy', 'ivy@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 182, 2, 'US', '2025-08-06 02:30:53', NULL, NULL),
(14, 'Jack', 'jack@gmail.com', '$2a$12$eYFvy1D9NXqRHyWM2q8HWuNbzfFQM/JHpKvhF2Xf8ZaTDTaRKluyO', 181, 2, 'SG', '2025-08-06 02:30:53', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
