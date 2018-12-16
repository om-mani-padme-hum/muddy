-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2018 at 11:21 PM
-- Server version: 5.7.19
-- PHP Version: 7.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `muddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `author` varchar(32) NOT NULL,
  `description` varchar(512) NOT NULL,
  `flags` text NOT NULL,
  `created` datetime NOT NULL,
  `itemPrototypes` text NOT NULL,
  `mobilePrototypes` text NOT NULL,
  `rooms` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` (`id`, `name`, `author`, `description`, `flags`, `created`, `itemPrototypes`, `mobilePrototypes`, `rooms`) VALUES
(1, 'Olenar', 'Rich Lowe', 'The Town of Olenar', '', '2018-07-18 00:00:00', '1,2,3', '1', '1,2'),
(2, 'Muddy', 'Rich Lowe', 'Repository for system items like corpses.', '', '2018-12-16 10:19:27', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `exits`
--

CREATE TABLE `exits` (
  `id` int(11) NOT NULL,
  `direction` int(11) NOT NULL,
  `target` int(11) DEFAULT NULL,
  `flags` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `item_instances`
--

CREATE TABLE `item_instances` (
  `id` int(11) NOT NULL,
  `prototype` int(11) DEFAULT NULL,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `description` varchar(512) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `details` text NOT NULL,
  `type` int(11) NOT NULL,
  `slot` int(11) NOT NULL,
  `flags` text NOT NULL,
  `contents` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `item_prototypes`
--

CREATE TABLE `item_prototypes` (
  `id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `description` varchar(512) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `details` text NOT NULL,
  `type` int(11) NOT NULL,
  `slot` int(11) NOT NULL,
  `flags` text NOT NULL,
  `contents` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `item_prototypes`
--

INSERT INTO `item_prototypes` (`id`, `created`, `name`, `names`, `description`, `roomDescription`, `details`, `type`, `slot`, `flags`, `contents`) VALUES
(1, '2018-12-16 13:10:37', 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', ''),
(2, '2018-12-16 13:10:37', 'a large burlap bag', 'bag', 'It looks like a reasonably strong burlap bag, despite obvious signs of use.', 'a large burlap bag sits on the ground', '{}', 0, 0, '2', ''),
(3, '2018-12-16 13:10:37', 'a translucent sphere of energy', 'ball!&|&!energy', 'It looks like a wieghtless and translucent spherical form of bound energy.', 'a translucent sphere of energy', '{}', 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `mobile_instances`
--

CREATE TABLE `mobile_instances` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `description` varchar(512) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `level` int(11) NOT NULL,
  `lineage` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `mana` int(11) NOT NULL,
  `energy` int(11) NOT NULL,
  `maxHealth` int(11) NOT NULL,
  `maxMana` int(11) NOT NULL,
  `maxEnergy` int(11) NOT NULL,
  `dodge` double NOT NULL,
  `affects` text NOT NULL,
  `prototype` int(11) DEFAULT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `mobile_prototypes`
--

CREATE TABLE `mobile_prototypes` (
  `id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `description` varchar(512) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `level` int(11) NOT NULL,
  `lineage` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `mana` int(11) NOT NULL,
  `energy` int(11) NOT NULL,
  `maxHealth` int(11) NOT NULL,
  `maxMana` int(11) NOT NULL,
  `maxEnergy` int(11) NOT NULL,
  `dodge` double NOT NULL,
  `affects` text NOT NULL,
  `scripts` mediumtext NOT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mobile_prototypes`
--

INSERT INTO `mobile_prototypes` (`id`, `created`, `name`, `names`, `description`, `roomDescription`, `level`, `lineage`, `path`, `health`, `mana`, `energy`, `maxHealth`, `maxMana`, `maxEnergy`, `dodge`, `affects`, `scripts`, `equipment`, `inventory`) VALUES
(1, '2018-12-16 13:10:11', 'a ragged beggar', 'beggar', 'a beggar covered in rags', 'a ragged beggar stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, 0, '', '', '', ''),
(2, '2018-12-16 13:10:11', 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, 0, '', '', '', ''),
(5, '2018-12-16 14:58:54', 'Test Mobile', '', 'Testing 1, 2, 3', '', 1, 0, 0, 100, 100, 100, 100, 100, 100, 10, '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(64) NOT NULL,
  `description` varchar(512) NOT NULL,
  `details` text NOT NULL,
  `flags` text NOT NULL,
  `exits` text NOT NULL,
  `items` text NOT NULL,
  `mobiles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `created`, `name`, `description`, `details`, `flags`, `exits`, `items`, `mobiles`) VALUES
(1, '2018-12-16 13:09:31', 'Limbo', 'You are floating in... space?', '{}', '', '', '', ''),
(2, '2018-12-16 13:09:31', 'The Forum of the Enlightened', 'You are standing in the middle of a very large, open forum, lined throughout the center with a variety of professionally landscaped gardens, mostly consisting of ferns, flowers, and palms, and loosely bordered with a multitude of busy shops and restaurants.  There are several smaller vendors and street performers dotted along the beautifully intricate tiled floor walkways.  They were obviously designed by a master of the art form.', '{}', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `level` int(11) NOT NULL,
  `lineage` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `mana` int(11) NOT NULL,
  `energy` int(11) NOT NULL,
  `maxHealth` int(11) NOT NULL,
  `maxMana` int(11) NOT NULL,
  `maxEnergy` int(11) NOT NULL,
  `dodge` double NOT NULL,
  `affects` text NOT NULL,
  `room` int(11) DEFAULT NULL,
  `addresses` mediumtext NOT NULL,
  `password` varchar(512) NOT NULL,
  `salt` varchar(32) NOT NULL,
  `experience` int(11) NOT NULL,
  `promptFormat` varchar(64) NOT NULL,
  `fightPromptFormat` varchar(64) NOT NULL,
  `title` varchar(32) NOT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `level`, `lineage`, `path`, `health`, `mana`, `energy`, `maxHealth`, `maxMana`, `maxEnergy`, `dodge`, `affects`, `room`, `addresses`, `password`, `salt`, `experience`, `promptFormat`, `fightPromptFormat`, `title`, `equipment`, `inventory`) VALUES
(3, 'Xodin', 1, 0, 0, 100, 100, 100, 100, 100, 100, 10, '', 2, '::1!&|&!::ffff:127.0.0.1', '62a023d7b861ba5334d778747d5e1dde07df5ce2ee90557526a255037c2ba4f3542b439be2d3ea9ba57295de3c8dd96cd409efd99d2f87c2562293ccd0ad1884', '3fc1a2ec51030dfa', 0, '\r\n[$xpxp] <$hphp $mm $ee> ', '\r\n[$xpxp] <$hphp $mm $ee> ', 'is old and tired.', '', ''),
(4, 'Ibacus', 1, 0, 0, 100, 100, 100, 100, 100, 100, 10, '', 1, '::1!&|&!::ffff:127.0.0.1', 'b58f1725ad80b709a5c87aff25cbe8cb0278e0812f317f09ef63d53522ed901b08328dad186431b5234ae6a04bf31f4b9c6edff3584f68418b3650d67c695b58', 'd6e26113c03c2911', 0, '\r\n[$xpxp] <$hphp $mm $ee> ', '\r\n[$xpxp] <$hphp $mm $ee> ', 'wants to be a MAGE!', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`) USING BTREE;

--
-- Indexes for table `exits`
--
ALTER TABLE `exits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_instances`
--
ALTER TABLE `item_instances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`) USING BTREE,
  ADD KEY `slot` (`slot`) USING BTREE;

--
-- Indexes for table `item_prototypes`
--
ALTER TABLE `item_prototypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`) USING BTREE,
  ADD KEY `slot` (`slot`) USING BTREE;

--
-- Indexes for table `mobile_instances`
--
ALTER TABLE `mobile_instances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mobile_prototypes`
--
ALTER TABLE `mobile_prototypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `exits`
--
ALTER TABLE `exits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `item_instances`
--
ALTER TABLE `item_instances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `item_prototypes`
--
ALTER TABLE `item_prototypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `mobile_instances`
--
ALTER TABLE `mobile_instances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `mobile_prototypes`
--
ALTER TABLE `mobile_prototypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
