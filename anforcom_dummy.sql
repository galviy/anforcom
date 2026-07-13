/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: anforcom_dummy
-- ------------------------------------------------------
-- Server version	12.3.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `changepass_dummy`
--

DROP TABLE IF EXISTS `changepass_dummy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `changepass_dummy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hashed_token` varchar(100) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `changepass_dummy`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `changepass_dummy` WRITE;
/*!40000 ALTER TABLE `changepass_dummy` DISABLE KEYS */;
INSERT INTO `changepass_dummy` VALUES
(1,'f41de4bf7d4f25b0f69b0d1524c334f4c6a366fcbc4fa6fd1c84d3fa58720e3f','2026-07-13 20:14:03',0,'galvindoser@gmail.com'),
(2,'71ca685548573bdd6148def62fb64ad74cf5330aba23159f1f5ce0433ac73983','2026-07-13 21:09:53',1,'galvindoser@gmail.com'),
(3,'712f32ee0fe1e57bec8aa6808c19a6b6b7e47510fcdf401dd8e301354b529caa','2026-07-13 21:14:16',0,'galvindoser@gmail.com');
/*!40000 ALTER TABLE `changepass_dummy` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `dummy_user`
--

DROP TABLE IF EXISTS `dummy_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dummy_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_tlp` varchar(100) NOT NULL,
  `tingkat_pendidikan_id` int(11) NOT NULL,
  `role_user` int(11) DEFAULT NULL,
  `date_register` datetime DEFAULT current_timestamp(),
  `token_verifikasi` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `token_expired_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_tingkat_pendidikan_FK` (`tingkat_pendidikan_id`),
  KEY `user_role_FK` (`role_user`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dummy_user`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dummy_user` WRITE;
/*!40000 ALTER TABLE `dummy_user` DISABLE KEYS */;
INSERT INTO `dummy_user` VALUES
(2,'galvintestemail','$2b$10$CznF7QStmyG0A.WPlxTsneRMNodWWrizI8/Fkr2mGU9.yzuWGQD/2','galvindoser@gmail.com','0848927874',1,1,'2026-07-10 22:54:08','27f0991a-82fe-41b7-85b1-2807a4de0549',0,NULL),
(3,'galvintestemail','$2b$10$Osk0mfegOtzPkTnY9fZPO.H8nDFEvseYlyPeINT1htFGMnYqs3rqK','galvindoser@gmail.com','0848927874',1,1,'2026-07-10 22:54:57','b05f2e48-bb1e-4576-a2d8-1874637a8314',0,NULL);
/*!40000 ALTER TABLE `dummy_user` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `isi_tim`
--

DROP TABLE IF EXISTS `isi_tim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `isi_tim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(255) NOT NULL,
  `asal_instansi` varchar(100) NOT NULL,
  `tim_id` int(11) DEFAULT NULL,
  `nomor_induk` varchar(100) NOT NULL,
  `data_image` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `isi_tim_tim_FK` (`tim_id`),
  CONSTRAINT `isi_tim_tim_FK` FOREIGN KEY (`tim_id`) REFERENCES `tim` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `isi_tim`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `isi_tim` WRITE;
/*!40000 ALTER TABLE `isi_tim` DISABLE KEYS */;
INSERT INTO `isi_tim` VALUES
(16,'galvin','undip',421,'240509999','d9b4e103-67c3-4d35-9d46-4b3ab547929c.png'),
(17,'dawawd','awdadw',422,'12322','055e775b-b7fa-4601-a8ce-f0a0721e8e24.png');
/*!40000 ALTER TABLE `isi_tim` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `lomba`
--

DROP TABLE IF EXISTS `lomba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lomba` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_lomba` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lomba`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `lomba` WRITE;
/*!40000 ALTER TABLE `lomba` DISABLE KEYS */;
INSERT INTO `lomba` VALUES
(1,'DUC (SMA/Sarjana)'),
(2,'DCPC (SMA/Sederajat)'),
(3,'DDSC (Sarjana)');
/*!40000 ALTER TABLE `lomba` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES
(1,'normal user'),
(2,'Administrator');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tim`
--

DROP TABLE IF EXISTS `tim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tim` (
  `nama_tim` varchar(100) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tim_lomba` int(11) DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tim_unique` (`nama_tim`),
  KEY `tim_lomba_FK` (`tim_lomba`),
  CONSTRAINT `tim_lomba_FK` FOREIGN KEY (`tim_lomba`) REFERENCES `lomba` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=423 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tim`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tim` WRITE;
/*!40000 ALTER TABLE `tim` DISABLE KEYS */;
INSERT INTO `tim` VALUES
('swag123',421,3,0),
('galvin2',422,1,0);
/*!40000 ALTER TABLE `tim` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tingkat_pendidikan`
--

DROP TABLE IF EXISTS `tingkat_pendidikan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tingkat_pendidikan` (
  `tingkat` varchar(100) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tingkat_pendidikan`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tingkat_pendidikan` WRITE;
/*!40000 ALTER TABLE `tingkat_pendidikan` DISABLE KEYS */;
INSERT INTO `tingkat_pendidikan` VALUES
('Sarjana',1),
('SMA/Sederajat',2);
/*!40000 ALTER TABLE `tingkat_pendidikan` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_tlp` varchar(100) NOT NULL,
  `tingkat_pendidikan_id` int(11) NOT NULL,
  `role_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique` (`username`),
  UNIQUE KEY `user_unique_1` (`no_tlp`),
  KEY `user_tingkat_pendidikan_FK` (`tingkat_pendidikan_id`),
  KEY `user_role_FK` (`role_user`),
  CONSTRAINT `user_role_FK` FOREIGN KEY (`role_user`) REFERENCES `role` (`id`),
  CONSTRAINT `user_tingkat_pendidikan_FK` FOREIGN KEY (`tingkat_pendidikan_id`) REFERENCES `tingkat_pendidikan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(5,'galvin2','$2b$10$iwAOWztRVpVRZwNZPGUVPO4XycOXyWbgU07kx2b.1VsJs9lMibGom','galvinchan0997@gmail.com','08589',1,1),
(7,'{{7*7}}','$2b$10$VAd0XMpqli2ojtcz4dpYuO0GWabYrY3BUtSzEsCZr8s.nSTql3DK2','galvindodawser@gmail.com','084892297874',1,1),
(8,'galvintest','$2b$10$iAvfQA1wl0QJUcGlUSjKSOUvCQnXuqNuus4rm2KPdvKDNe82Spl22','galvindoserr@gmail.com','0848992297874',1,1),
(9,'galvinpentest','$2b$10$wV1bCPlMfExl.aDITlhvbuni6YIRK8EuopgIBsfswvG9Ihr7TSY0y','galvinexploit@gmail.com','0816102627',2,1),
(10,'galvin123','$2b$10$j7CxzycN0e2OLC6WgqTGe.cbopqpraaEYoLY7bsvNAYTDAP.OHg1a','galvin123@gmail.com','085892297871',1,1),
(11,'v33n','$2b$10$8rZ5DJU0FzuZQlw7KzoK7.Hfad9R7IQMc/IvBE1GVn6gXrBrnsg42','123@gmail.com','081610218',1,1),
(17,'galvin','$2b$10$b/OQsKFuQ6p795TYj0oXdeRQLle1tYVQkq4XtjsQaXBasXGQFg0pW','galvindoser@gmail.com','21212112',1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user_tim`
--

DROP TABLE IF EXISTS `user_tim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tim` (
  `tim_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`tim_id`,`user_id`),
  KEY `user_tim_user_FK` (`user_id`),
  CONSTRAINT `user_tim_tim_FK` FOREIGN KEY (`tim_id`) REFERENCES `tim` (`id`),
  CONSTRAINT `user_tim_user_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tim`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user_tim` WRITE;
/*!40000 ALTER TABLE `user_tim` DISABLE KEYS */;
INSERT INTO `user_tim` VALUES
(421,17),
(422,17);
/*!40000 ALTER TABLE `user_tim` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-07-13 20:49:55
