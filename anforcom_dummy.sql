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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
(3,'712f32ee0fe1e57bec8aa6808c19a6b6b7e47510fcdf401dd8e301354b529caa','2026-07-13 21:14:16',0,'galvindoser@gmail.com'),
(4,'c1b46fe58cb365b827e42e08b6991d0365271692212009dfad015f7e52639704','2026-07-13 21:58:56',0,'galvindoser@gmail.com'),
(5,'f5fd5fc844172e760011afb1ee7805ebeac81af17921b8d6a6b2c16aac26ea93','2026-07-13 21:59:39',0,'galvindoser@gmail.com'),
(6,'c117f90c33908373831c1a5a147f8f181b7eded7a5fca5a94b56479eb38ba3f4','2026-07-14 20:03:36',1,'galvindoser@gmail.com'),
(7,'0ccc6fabbedf9d5bea2a6a0d099bbbdda50d2936e31b923555325f6c8da1376a','2026-07-16 11:55:17',0,'galvindoser@gmail.com'),
(8,'9138015f0aa42dbeb47ae9f134f8465a02d23324c6e9d17489464829263654fd','2026-07-16 11:56:10',1,'galvindoser@gmail.com'),
(9,'91d304a8605edb37b0614c4e515dcdb20cacf7da81ac84bbf45436707d138080','2026-07-16 12:13:28',1,'galvindoser@gmail.com');
/*!40000 ALTER TABLE `changepass_dummy` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `data_pembayaran`
--

DROP TABLE IF EXISTS `data_pembayaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_pembayaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tim` int(11) NOT NULL,
  `foto_qris` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_tim` (`id_tim`),
  CONSTRAINT `data_pembayaran_tim_FK` FOREIGN KEY (`id_tim`) REFERENCES `tim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pembayaran`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `data_pembayaran` WRITE;
/*!40000 ALTER TABLE `data_pembayaran` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pembayaran` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `data_pernyataan`
--

DROP TABLE IF EXISTS `data_pernyataan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_pernyataan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tim` int(11) NOT NULL,
  `foto_pernyataan` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_tim` (`id_tim`),
  CONSTRAINT `data_pernyataan_tim_FK` FOREIGN KEY (`id_tim`) REFERENCES `tim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_pernyataan`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `data_pernyataan` WRITE;
/*!40000 ALTER TABLE `data_pernyataan` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_pernyataan` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `data_proposal`
--

DROP TABLE IF EXISTS `data_proposal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_proposal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tim` int(11) NOT NULL,
  `data_proposal` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `data_proposal_tim_FK` (`id_tim`),
  CONSTRAINT `data_proposal_tim_FK` FOREIGN KEY (`id_tim`) REFERENCES `tim` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_proposal`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `data_proposal` WRITE;
/*!40000 ALTER TABLE `data_proposal` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_proposal` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `data_twibbon`
--

DROP TABLE IF EXISTS `data_twibbon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_twibbon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `isi_tim_data_twibbon` int(11) NOT NULL,
  `foto_twibbon` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `data_twibbon_isi_tim_FK` (`isi_tim_data_twibbon`),
  CONSTRAINT `data_twibbon_isi_tim_FK` FOREIGN KEY (`isi_tim_data_twibbon`) REFERENCES `isi_tim` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_twibbon`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `data_twibbon` WRITE;
/*!40000 ALTER TABLE `data_twibbon` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_twibbon` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dummy_user`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `dummy_user` WRITE;
/*!40000 ALTER TABLE `dummy_user` DISABLE KEYS */;
INSERT INTO `dummy_user` VALUES
(2,'galvintestemail','$2b$10$CznF7QStmyG0A.WPlxTsneRMNodWWrizI8/Fkr2mGU9.yzuWGQD/2','galvindoser@gmail.com','0848927874',1,1,'2026-07-10 22:54:08','27f0991a-82fe-41b7-85b1-2807a4de0549',0,NULL),
(3,'galvintestemail','$2b$10$Osk0mfegOtzPkTnY9fZPO.H8nDFEvseYlyPeINT1htFGMnYqs3rqK','galvindoser@gmail.com','0848927874',1,1,'2026-07-10 22:54:57','b05f2e48-bb1e-4576-a2d8-1874637a8314',0,NULL),
(10,'galvincobacoba','$2b$10$Bx6TeDnhWdSwezpCzB5Ls.AimiWUA9uSDz/5aB3iOETmw7qURmoX.','galvinalber@gmail.com','2297874',1,1,'2026-07-13 21:27:53','yVoyzXHwCU3-T-P9K9bzBaf_8NaPrwCjmZlOlxIQ_sgbCRK67uK9J1ldTf5AQnIK4dj922XR',0,NULL),
(11,'galvincobacoba','$2b$10$SRtQp7zmLduFqYAnadpjQe/dRh.5lOQm6TVLTftLIuL/kiLRDurv.','galvinalber@gmail.com','2297874',1,1,'2026-07-13 21:29:35','iimtqXUk1k1VGq2soFEZfcE04divRZUZjyu2eLAZNrFcp3MtoeMtoOIr2oTyI533sDp22WWe',0,NULL),
(12,'galvincobacoba','$2b$10$uAONHuc429pSKU/lZ/67G.L6aG/ylaQ/G33kfxvwkWo.2E/nITmoi','galvinalber@gmail.com','2297874',1,1,'2026-07-13 21:29:52','a08NXpgRzHORIKFNdbyrON1s-HQjjR6hjQW1Oh25s7F2HezQwMwxk312fDdyy1yXb-aHx4Ye',0,NULL),
(13,'galvincobacoba','$2b$10$fpO4qeGOp5JnY1TZccYgKe4jiTiah446EBIC5WaGZ/RaAiYBqM4l.','galvinalber@gmail.com','2297874',1,1,'2026-07-13 21:30:29','0TskzQEF1tODz49JCWRMdtKVG4Sikr_LwdRkFm4sVeuRTM9dege4_L6NzZYijcdHGzNQIzFl',0,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `isi_tim`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `isi_tim` WRITE;
/*!40000 ALTER TABLE `isi_tim` DISABLE KEYS */;
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
(3,'DDSC (SMA/Sarjana)');
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
) ENGINE=InnoDB AUTO_INCREMENT=437 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tim`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tim` WRITE;
/*!40000 ALTER TABLE `tim` DISABLE KEYS */;
INSERT INTO `tim` VALUES
('\"><script>alert(1)</script>',425,1,0),
('cp ni boss',436,2,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(7,'{{7*7}}','$2b$10$VAd0XMpqli2ojtcz4dpYuO0GWabYrY3BUtSzEsCZr8s.nSTql3DK2','galvindodawser@gmail.com','084892297874',1,1),
(8,'galvintest','$2b$10$iAvfQA1wl0QJUcGlUSjKSOUvCQnXuqNuus4rm2KPdvKDNe82Spl22','galvindoserr@gmail.com','0848992297874',1,1),
(9,'galvinpentest','$2b$10$wV1bCPlMfExl.aDITlhvbuni6YIRK8EuopgIBsfswvG9Ihr7TSY0y','galvinexploit@gmail.com','0816102627',2,1),
(10,'galvin123','$2b$10$j7CxzycN0e2OLC6WgqTGe.cbopqpraaEYoLY7bsvNAYTDAP.OHg1a','galvin123@gmail.com','085892297871',1,1),
(11,'v33n','$2b$10$8rZ5DJU0FzuZQlw7KzoK7.Hfad9R7IQMc/IvBE1GVn6gXrBrnsg42','123@gmail.com','081610218',1,1),
(17,'galvin','$2b$10$AytAsAcVERvWtEQiK0mi4eIeySMhgrGmcgmJWIolF8/CjDkcnIlTm','galvindoser@gmail.com','21212112',1,1),
(18,'galvingalvin','$2b$10$oczO2RxeQS6rjBudwD11SuSC.Mk9yUBcny2VrID91x394orWY.hDG','galvinchan0997@gmail.com','081291221',2,1),
(19,'galvinchan0997@gmail.com','$2b$10$KKL2MNFfkarkWhOaHXYCnemV4HUVPPgPdjIOi6ZseFkJIQEB0bJvS','galvinalber@gmail.com','088912812',2,1);
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
(425,18),
(436,19);
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

-- Dump completed on 2026-08-08 12:24:56
