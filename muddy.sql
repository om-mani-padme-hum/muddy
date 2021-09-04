CREATE DATABASE  IF NOT EXISTS `muddy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `muddy`;
-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: muddy
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `author` varchar(32) NOT NULL,
  `description` varchar(512) NOT NULL,
  `flags` text NOT NULL,
  `created` datetime NOT NULL,
  `itemPrototypes` text NOT NULL,
  `mobilePrototypes` text NOT NULL,
  `rooms` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (1,'Olenar','Xodin','The Town of Olenar','','2018-07-20 17:00:00','','','1,2,21,25'),(2,'Muddy','Rich Lowe','Repository for system items like corpses.','','2018-12-16 16:19:27','','','');
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deployments`
--

DROP TABLE IF EXISTS `deployments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deployments` (
  `count` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refresh` int(11) NOT NULL,
  `subject` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployments`
--

LOCK TABLES `deployments` WRITE;
/*!40000 ALTER TABLE `deployments` DISABLE KEYS */;
/*!40000 ALTER TABLE `deployments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exits`
--

DROP TABLE IF EXISTS `exits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `direction` int(11) NOT NULL,
  `target` int(11) DEFAULT NULL,
  `flags` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exits`
--

LOCK TABLES `exits` WRITE;
/*!40000 ALTER TABLE `exits` DISABLE KEYS */;
INSERT INTO `exits` VALUES (31,0,21,''),(32,4,2,'');
/*!40000 ALTER TABLE `exits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help`
--

DROP TABLE IF EXISTS `help`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `help` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help`
--

LOCK TABLES `help` WRITE;
/*!40000 ALTER TABLE `help` DISABLE KEYS */;
/*!40000 ALTER TABLE `help` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_instances`
--

DROP TABLE IF EXISTS `item_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_instances` (
  `accuracy` int(11) NOT NULL,
  `air` int(11) NOT NULL,
  `armor` int(11) NOT NULL,
  `contents` text NOT NULL,
  `deflection` int(11) NOT NULL,
  `description` varchar(512) NOT NULL,
  `details` text NOT NULL,
  `dodge` int(11) NOT NULL,
  `earth` int(11) NOT NULL,
  `fire` int(11) NOT NULL,
  `flags` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `life` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `power` int(11) NOT NULL,
  `prototype` int(11) DEFAULT NULL,
  `rarity` int(11) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `slot` int(11) NOT NULL,
  `speed` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `water` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_instances`
--

LOCK TABLES `item_instances` WRITE;
/*!40000 ALTER TABLE `item_instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_prototypes`
--

DROP TABLE IF EXISTS `item_prototypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_prototypes` (
  `author` varchar(32) NOT NULL,
  `created` datetime NOT NULL,
  `description` varchar(512) NOT NULL,
  `details` text NOT NULL,
  `flags` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `names` mediumtext NOT NULL,
  `rarity` int(11) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `slot` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_prototypes`
--

LOCK TABLES `item_prototypes` WRITE;
/*!40000 ALTER TABLE `item_prototypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_prototypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mobile_instances`
--

DROP TABLE IF EXISTS `mobile_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mobile_instances` (
  `affects` text NOT NULL,
  `energy` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mana` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `race` int(11) NOT NULL,
  `sex` tinyint(4) NOT NULL,
  `description` varchar(512) NOT NULL,
  `equipment` text NOT NULL,
  `inventory` text NOT NULL,
  `names` mediumtext NOT NULL,
  `prototype` int(11) DEFAULT NULL,
  `rarity` int(11) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mobile_instances`
--

LOCK TABLES `mobile_instances` WRITE;
/*!40000 ALTER TABLE `mobile_instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `mobile_instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mobile_prototypes`
--

DROP TABLE IF EXISTS `mobile_prototypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mobile_prototypes` (
  `affects` text NOT NULL,
  `energy` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mana` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `path` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `race` int(11) NOT NULL,
  `sex` tinyint(4) NOT NULL,
  `author` varchar(32) NOT NULL,
  `created` datetime NOT NULL,
  `description` varchar(512) NOT NULL,
  `names` mediumtext NOT NULL,
  `rarity` int(11) NOT NULL,
  `roomDescription` varchar(80) NOT NULL,
  `scripts` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mobile_prototypes`
--

LOCK TABLES `mobile_prototypes` WRITE;
/*!40000 ALTER TABLE `mobile_prototypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mobile_prototypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(32) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(64) NOT NULL,
  `description` varchar(512) NOT NULL,
  `details` text NOT NULL,
  `flags` text NOT NULL,
  `exits` text NOT NULL,
  `items` text NOT NULL,
  `mobiles` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Xodin','2018-12-16 13:09:31','Limbo','You are floating in... space?','{}','','','',''),(2,'Xodin','2018-12-18 13:09:31','The Forum of the Enlightened','You are standing in the middle of a very large, open forum, lined throughout the center with a variety of professionally landscaped gardens, mostly consisting of ferns, flowers, and palms, and loosely bordered with a multitude of busy shops and restaurants.  There are several smaller vendors and street performers dotted along the beautifully intricate tiled floor walkways.  They were obviously designed by a master of the art form.','{}','','31','',''),(21,'Xodin','1970-01-03 00:00:00','The Forum of the Enlightened','You are standing in the middle of a very large, open forum, lined throughout the center with a variety of professionally landscaped gardens, mostly consisting of ferns, flowers, and palms, and loosely bordered with a multitude of busy shops and restaurants.  There are several smaller vendors and street performers dotted along the beautifully intricate tiled floor walkways.  They were obviously designed by a master of the art form.','{}','','32','',''),(25,'Xodin','2019-03-17 15:53:07','An empty room','This room looks quite boring, just plain everything.','{}','','','','');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `level` int(11) NOT NULL,
  `lineage` int(11) NOT NULL,
  `path` int(11) NOT NULL,
  `sex` tinyint(4) NOT NULL,
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
  `inventory` text NOT NULL,
  `position` int(11) NOT NULL,
  `race` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Xodin',1,0,0,0,100,100,100,100,100,100,'',2,'::1!&|&!::ffff:127.0.0.1','62a023d7b861ba5334d778747d5e1dde07df5ce2ee90557526a255037c2ba4f3542b439be2d3ea9ba57295de3c8dd96cd409efd99d2f87c2562293ccd0ad1884','3fc1a2ec51030dfa',0,'[$xpxp] <$hphp $mm $ee> ','[$xpxp] <$hphp $mm $ee> ','is old and tired.','','',0,0),(4,'Ibacus',1,0,0,0,100,100,100,100,100,100,'',2,'::1!&|&!::ffff:127.0.0.1','b58f1725ad80b709a5c87aff25cbe8cb0278e0812f317f09ef63d53522ed901b08328dad186431b5234ae6a04bf31f4b9c6edff3584f68418b3650d67c695b58','d6e26113c03c2911',0,'[$xpxp] <$hphp $mm $ee> ','[$xpxp] <$hphp $mm $ee> ','wants to be a MAGE!','','',0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-09-04  9:39:27
