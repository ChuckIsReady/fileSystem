/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.1.70-community : Database - file_system
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`file_system` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `file_system`;

/*Table structure for table `file_detail` */

DROP TABLE IF EXISTS `file_detail`;

CREATE TABLE `file_detail` (
  `fileID` int(5) NOT NULL,
  `fileName` char(15) DEFAULT NULL,
  `fileOwner` char(10) DEFAULT NULL,
  `fileType` tinyint(4) DEFAULT NULL,
  `fileCreateTime` char(25) DEFAULT NULL,
  `isLocked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`fileID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `file_detail` */

/*Table structure for table `file_inner` */

DROP TABLE IF EXISTS `file_inner`;

CREATE TABLE `file_inner` (
  `fileID` int(5) NOT NULL,
  `fileInner` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`fileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `file_inner` */

/*Table structure for table `folder_relationship` */

DROP TABLE IF EXISTS `folder_relationship`;

CREATE TABLE `folder_relationship` (
  `fileID` int(5) NOT NULL,
  `childrenFileIDArr` varchar(200) DEFAULT NULL,
  `parentFolderID` int(5) DEFAULT NULL,
  PRIMARY KEY (`fileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `folder_relationship` */

insert  into `folder_relationship`(`fileID`,`childrenFileIDArr`,`parentFolderID`) values (0,'',0);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `name` char(10) NOT NULL COMMENT '用户名',
  `passWord` char(15) DEFAULT NULL COMMENT '密码',
  `fileNum` int(4) DEFAULT NULL COMMENT '文件数量',
  `folderNum` int(4) DEFAULT NULL COMMENT '文件夹数量',
  `storageMAX` int(4) DEFAULT NULL COMMENT '存储数量上限',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`name`,`passWord`,`fileNum`,`folderNum`,`storageMAX`) values ('admin',NULL,0,0,100);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
