-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2021 at 03:26 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `collection`
--

-- --------------------------------------------------------

--
-- Table structure for table `collections_tb`
--

CREATE TABLE `collections_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `collections_tb`
--

INSERT INTO `collections_tb` (`id`, `name`, `user_id`, `created_at`, `update_at`) VALUES
(1, 'Study', 1, '2021-11-10 08:48:03', '2021-11-10 08:48:03'),
(2, 'Travelling', 1, '2021-11-10 08:49:51', '2021-11-10 08:49:51'),
(3, 'Bermain', 2, '2021-11-10 11:15:24', '2021-11-10 11:15:24'),
(4, 'Film', 2, '2021-11-10 12:23:01', '2021-11-10 12:23:01'),
(8, 'berhitung', 2, '2021-11-10 13:55:23', '2021-11-10 13:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `task_tb`
--

CREATE TABLE `task_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `is_done` tinyint(1) NOT NULL,
  `collections_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_id` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `task_tb`
--

INSERT INTO `task_tb` (`id`, `name`, `is_done`, `collections_id`, `created_at`, `updated_id`) VALUES
(1, 'Matematika', 0, 1, '2021-11-10 09:37:17', '2021-11-10 09:37:17'),
(2, 'Jogja', 0, 2, '2021-11-10 09:38:26', '2021-11-10 09:38:26'),
(3, 'Bandung', 0, 2, '2021-11-10 10:31:14', '2021-11-10 10:31:14'),
(4, 'Jakarta', 0, 2, '2021-11-10 11:00:23', '2021-11-10 11:00:23'),
(5, 'Biologi', 0, 1, '2021-11-10 11:02:44', '2021-11-10 11:02:44'),
(6, 'Bali', 0, 2, '2021-11-10 11:06:19', '2021-11-10 11:06:19'),
(8, 'Bahasa Indonesia', 0, 1, '2021-11-10 11:08:12', '2021-11-10 11:08:12'),
(10, 'Surabaya', 0, 2, '2021-11-10 12:19:34', '2021-11-10 12:19:34'),
(12, 'Doraemon', 0, 4, '2021-11-10 13:19:23', '2021-11-10 13:19:23'),
(13, 'PUBG', 0, 3, '2021-11-10 13:19:50', '2021-11-10 13:19:50');

-- --------------------------------------------------------

--
-- Table structure for table `users_tb`
--

CREATE TABLE `users_tb` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_tb`
--

INSERT INTO `users_tb` (`id`, `email`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'afifah@gmail.com', 'afifah', '12345', '2021-11-10 06:43:45', '2021-11-10 13:43:45'),
(2, 'Budi@gmail.com', 'budi', '12345', '2021-11-10 11:09:06', '2021-11-10 18:09:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collections_tb`
--
ALTER TABLE `collections_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `task_tb`
--
ALTER TABLE `task_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collections_id` (`collections_id`);

--
-- Indexes for table `users_tb`
--
ALTER TABLE `users_tb`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `collections_tb`
--
ALTER TABLE `collections_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `task_tb`
--
ALTER TABLE `task_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users_tb`
--
ALTER TABLE `users_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `collections_tb`
--
ALTER TABLE `collections_tb`
  ADD CONSTRAINT `collections_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tb` (`id`);

--
-- Constraints for table `task_tb`
--
ALTER TABLE `task_tb`
  ADD CONSTRAINT `task_tb_ibfk_1` FOREIGN KEY (`collections_id`) REFERENCES `collections_tb` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
