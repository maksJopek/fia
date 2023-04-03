-- MariaDB dump 10.19  Distrib 10.11.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: ClientApps
-- ------------------------------------------------------
-- Server version	10.11.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fia`
--

DROP TABLE IF EXISTS `fia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameBoard` text DEFAULT '{"map":[{"x":0,"y":4,"chequers":[],"start":1},{"x":1,"y":4,"chequers":[],"start":-1},{"x":2,"y":4,"chequers":[],"start":-1},{"x":3,"y":4,"chequers":[],"start":-1},{"x":4,"y":4,"chequers":[],"start":-1},{"x":4,"y":3,"chequers":[],"start":-1},{"x":4,"y":2,"chequers":[],"start":-1},{"x":4,"y":1,"chequers":[],"start":-1},{"x":4,"y":0,"chequers":[],"start":-1},{"x":5,"y":0,"chequers":[],"start":-1},{"x":6,"y":0,"chequers":[],"start":0},{"x":6,"y":1,"chequers":[],"start":-1},{"x":6,"y":2,"chequers":[],"start":-1},{"x":6,"y":3,"chequers":[],"start":-1},{"x":6,"y":4,"chequers":[],"start":-1},{"x":7,"y":4,"chequers":[],"start":-1},{"x":8,"y":4,"chequers":[],"start":-1},{"x":9,"y":4,"chequers":[],"start":-1},{"x":10,"y":4,"chequers":[],"start":-1},{"x":10,"y":5,"chequers":[],"start":-1},{"x":10,"y":6,"chequers":[],"start":2},{"x":9,"y":6,"chequers":[],"start":-1},{"x":8,"y":6,"chequers":[],"start":-1},{"x":7,"y":6,"chequers":[],"start":-1},{"x":6,"y":6,"chequers":[],"start":-1},{"x":6,"y":7,"chequers":[],"start":-1},{"x":6,"y":8,"chequers":[],"start":-1},{"x":6,"y":9,"chequers":[],"start":-1},{"x":6,"y":10,"chequers":[],"start":-1},{"x":5,"y":10,"chequers":[],"start":-1},{"x":4,"y":10,"chequers":[],"start":3},{"x":4,"y":9,"chequers":[],"start":-1},{"x":4,"y":8,"chequers":[],"start":-1},{"x":4,"y":7,"chequers":[],"start":-1},{"x":4,"y":6,"chequers":[],"start":-1},{"x":3,"y":6,"chequers":[],"start":-1},{"x":2,"y":6,"chequers":[],"start":-1},{"x":1,"y":6,"chequers":[],"start":-1},{"x":0,"y":6,"chequers":[],"start":-1},{"x":0,"y":5,"chequers":[],"start":-1}],"bases":{"0":[{"x":8,"y":1,"chequer":-1},{"x":9,"y":1,"chequer":-1},{"x":9,"y":2,"chequer":-1},{"x":8,"y":2,"chequer":-1}],"1":[{"x":1,"y":1,"chequer":-1},{"x":1,"y":2,"chequer":-1},{"x":2,"y":2,"chequer":-1},{"x":2,"y":1,"chequer":-1}],"2":[{"x":8,"y":8,"chequer":-1},{"x":9,"y":8,"chequer":-1},{"x":9,"y":9,"chequer":-1},{"x":8,"y":9,"chequer":-1}],"3":[{"x":1,"y":8,"chequer":-1},{"x":2,"y":8,"chequer":-1},{"x":2,"y":9,"chequer":-1},{"x":1,"y":9,"chequer":-1}]},"homes":{"1":[{"x":1,"y":5,"chequer":-1},{"x":2,"y":5,"chequer":-1},{"x":3,"y":5,"chequer":-1},{"x":4,"y":5,"chequer":-1}],"0":[{"x":5,"y":1,"chequer":-1},{"x":5,"y":2,"chequer":-1},{"x":5,"y":3,"chequer":-1},{"x":5,"y":4,"chequer":-1}],"3":[{"x":5,"y":9,"chequer":-1},{"x":5,"y":8,"chequer":-1},{"x":5,"y":7,"chequer":-1},{"x":5,"y":6,"chequer":-1}],"2":[{"x":9,"y":5,"chequer":-1},{"x":8,"y":5,"chequer":-1},{"x":7,"y":5,"chequer":-1},{"x":6,"y":5,"chequer":-1}]}}',
  `currentPlayer` int(11) DEFAULT 0,
  `started` tinyint(1) DEFAULT 0,
  `data` text DEFAULT NULL,
  `timeTillTurnEnd` bigint(20) DEFAULT NULL,
  `winner` int(11) DEFAULT NULL,
  `playersCount` int(11) DEFAULT 0,
  `playersAreReady` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fia`
--

LOCK TABLES `fia` WRITE;
/*!40000 ALTER TABLE `fia` DISABLE KEYS */;
/*!40000 ALTER TABLE `fia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-03 22:10:18
