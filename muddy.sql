-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2018 at 02:44 AM
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
(1, 'Olenar', 'Rich Lowe', 'The Town of Olenar', '', '2018-07-18 00:00:00', '1,2', '1', '1,9,10,11,12,13,14,15,16'),
(2, 'A boring area', 'Xodin', 'This area is totally boring, who would visit here?', '', '2018-07-21 18:07:46', '', '2', '17,18,19');

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

--
-- Dumping data for table `exits`
--

INSERT INTO `exits` (`id`, `direction`, `target`, `flags`) VALUES
(9, 0, 9, ''),
(10, 4, 1, ''),
(11, 5, 10, ''),
(12, 1, 9, ''),
(13, 4, 11, ''),
(14, 0, 1, ''),
(15, 6, 12, ''),
(16, 2, 11, ''),
(17, 2, 13, ''),
(18, 6, 10, ''),
(19, 0, 14, ''),
(20, 4, 13, ''),
(21, 7, 15, ''),
(22, 3, 1, ''),
(23, 2, 16, ''),
(24, 6, 1, ''),
(25, 0, 18, ''),
(26, 4, 17, ''),
(27, 0, 19, ''),
(28, 4, 18, '');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
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
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `names`, `description`, `roomDescription`, `details`, `type`, `slot`, `flags`, `contents`) VALUES
(1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', ''),
(2, 'a large burlap bag', 'bag', 'It looks like a reasonably strong burlap bag, despite obvious signs of use.', 'a large burlap bag sits on the ground', '{}', 0, 0, '2', '');

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

--
-- Dumping data for table `item_instances`
--

INSERT INTO `item_instances` (`id`, `prototype`, `name`, `names`, `description`, `roomDescription`, `details`, `type`, `slot`, `flags`, `contents`) VALUES
(1, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', ''),
(14, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(15, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(16, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(17, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(18, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(19, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(20, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(21, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 0, 0, '', ''),
(27, 2, 'a large burlap bag', 'bag', 'It looks like a reasonably strong burlap bag, despite obvious signs of use.', 'a large burlap bag sits on the ground', '{}', 0, 0, '2', '17'),
(28, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', ''),
(29, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', ''),
(30, 1, 'a wooden club', 'club', 'It appears to be a club made from a knotted branch of wood.', 'a wooden club lies here', '{}', 13, 13, '1', '');

-- --------------------------------------------------------

--
-- Table structure for table `mobiles`
--

CREATE TABLE `mobiles` (
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
  `affects` text NOT NULL,
  `scripts` mediumtext NOT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mobiles`
--

INSERT INTO `mobiles` (`id`, `name`, `names`, `description`, `roomDescription`, `level`, `lineage`, `path`, `health`, `mana`, `energy`, `maxHealth`, `maxMana`, `maxEnergy`, `affects`, `scripts`, `equipment`, `inventory`) VALUES
(1, 'a ragged beggar', 'beggar', 'a beggar covered in rags', 'a ragged beggar stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', '', '', ''),
(2, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', '', '', '');

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
  `affects` text NOT NULL,
  `prototype` int(11) DEFAULT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mobile_instances`
--

INSERT INTO `mobile_instances` (`id`, `name`, `names`, `description`, `roomDescription`, `level`, `lineage`, `path`, `health`, `mana`, `energy`, `maxHealth`, `maxMana`, `maxEnergy`, `affects`, `prototype`, `equipment`, `inventory`) VALUES
(14, 'a ragged beggar', 'beggar', 'a beggar covered in rags', 'a ragged beggar stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 1, '', ''),
(15, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', '', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', -1, '', ''),
(16, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', -1, '', ''),
(17, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', -1, '', ''),
(18, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(19, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(20, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(21, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(22, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(23, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(24, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', ''),
(25, 'a boring person', 'person', 'They look like the most boring person you could possibly imagine.', 'a boring person stands here', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 2, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(512) NOT NULL,
  `details` text NOT NULL,
  `flags` text NOT NULL,
  `exits` text NOT NULL,
  `itemPrototypes` text NOT NULL,
  `items` text NOT NULL,
  `mobilePrototypes` text NOT NULL,
  `mobiles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `description`, `details`, `flags`, `exits`, `itemPrototypes`, `items`, `mobilePrototypes`, `mobiles`) VALUES
(1, 'The Forum of the Enlightened', 'You are standing in the middle of a very large, open forum, lined throughout the center with a variety of professionally landscaped gardens, mostly consisting of ferns, flowers, and palms, and loosely bordered with a multitude of busy shops and restaurants.  There are several smaller vendors and street performers dotted along the beautifully intricate tiled floor walkways.  They were obviously designed by a master of the art form.', '{}', '', '9,13,21,23', '1', '', '', '20'),
(9, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '10,11', '', '', '1', '14'),
(10, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '12,17', '', '', '', ''),
(11, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '14,15', '', '', '', ''),
(12, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '16', '', '', '', ''),
(13, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '18,19', '', '', '', ''),
(14, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '20', '', '', '', ''),
(15, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '22', '', '', '', ''),
(16, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '24', '', '', '', ''),
(17, 'A boring room', 'This room looks quite boring, just plain everything.', '{}', '', '25', '', '18,19', '', '22,23,24'),
(18, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '26,27', '', '16', '', '25'),
(19, 'An empty room', 'This room looks quite boring, just plain everything.', '{}', '', '28', '', '', '', '');

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

INSERT INTO `users` (`id`, `name`, `level`, `lineage`, `path`, `health`, `mana`, `energy`, `maxHealth`, `maxMana`, `maxEnergy`, `affects`, `room`, `addresses`, `password`, `salt`, `experience`, `promptFormat`, `fightPromptFormat`, `title`, `equipment`, `inventory`) VALUES
(3, 'Xodin', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 1, '::1!&|&!::ffff:127.0.0.1', '62a023d7b861ba5334d778747d5e1dde07df5ce2ee90557526a255037c2ba4f3542b439be2d3ea9ba57295de3c8dd96cd409efd99d2f87c2562293ccd0ad1884', '3fc1a2ec51030dfa', 0, '\r\n[$xpxp] <$hphp $mm $ee> ', '\r\n[$xpxp] <$hphp $mm $ee> ', 'is old and tired.', '1,30', '27,29,28'),
(4, 'Ibacus', 1, 0, 0, 100, 100, 100, 100, 100, 100, '', 1, '::1!&|&!::ffff:127.0.0.1', 'b58f1725ad80b709a5c87aff25cbe8cb0278e0812f317f09ef63d53522ed901b08328dad186431b5234ae6a04bf31f4b9c6edff3584f68418b3650d67c695b58', 'd6e26113c03c2911', 0, '\r\n[$xpxp] <$hphp $mm $ee> ', '\r\n[$xpxp] <$hphp $mm $ee> ', 'wants to be a MAGE!', '', '');

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
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`) USING BTREE,
  ADD KEY `slot` (`slot`) USING BTREE;

--
-- Indexes for table `item_instances`
--
ALTER TABLE `item_instances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`) USING BTREE,
  ADD KEY `slot` (`slot`) USING BTREE;

--
-- Indexes for table `mobiles`
--
ALTER TABLE `mobiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mobile_instances`
--
ALTER TABLE `mobile_instances`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `exits`
--
ALTER TABLE `exits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `item_instances`
--
ALTER TABLE `item_instances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `mobiles`
--
ALTER TABLE `mobiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `mobile_instances`
--
ALTER TABLE `mobile_instances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
