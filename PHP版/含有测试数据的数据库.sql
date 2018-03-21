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

insert  into `file_detail`(`fileID`,`fileName`,`fileOwner`,`fileType`,`fileCreateTime`,`isLocked`) values (2504,'文件1号.txt','admin',0,'2016/1/11 下午1:38:45',0),(2502,'欢迎使用.txt','Chuck',0,'2016/01/11  上午01:38:20',1),(5850,'Chuck','Chuck',1,'2016/01/11  上午01:38:20',0),(7427,'欢迎使用.txt','Alex',0,'2016/01/11  上午01:38:01',1),(81,'Alex','Alex',1,'2016/01/11  上午01:38:01',0),(8013,'123.txt','admin',0,'2016/1/11 下午1:37:46',0),(3800,'文件夹C','admin',1,'2016/1/11 下午1:37:34',0),(1388,'文件夹B','admin',1,'2016/1/11 下午1:37:29',0),(3629,'文件夹A','admin',1,'2016/1/11 下午1:37:26',0),(2028,'文件夹2号','admin',1,'2016/1/11 下午1:37:18',0),(8954,'文件夹1号','admin',1,'2016/1/11 下午1:37:13',0);

/*Table structure for table `file_inner` */

DROP TABLE IF EXISTS `file_inner`;

CREATE TABLE `file_inner` (
  `fileID` int(5) NOT NULL,
  `fileInner` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`fileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `file_inner` */

insert  into `file_inner`(`fileID`,`fileInner`) values (2502,'亲爱的Chuck,\n	欢迎使用Chuck文件系统！祝你有个好心情！'),(2504,''),(7427,'亲爱的Alex,\n	欢迎使用Chuck文件系统！祝你有个好心情！'),(8013,'');

/*Table structure for table `folder_relationship` */

DROP TABLE IF EXISTS `folder_relationship`;

CREATE TABLE `folder_relationship` (
  `fileID` int(5) NOT NULL,
  `childrenFileIDArr` varchar(200) DEFAULT NULL,
  `parentFolderID` int(5) DEFAULT NULL,
  PRIMARY KEY (`fileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `folder_relationship` */

insert  into `folder_relationship`(`fileID`,`childrenFileIDArr`,`parentFolderID`) values (0,'8954,2028,81,5850,2504',0),(81,'7427',0),(1388,'',8954),(2028,'',0),(3629,'3800',8954),(3800,'',3629),(5850,'2502',0),(8954,'3629,1388,8013',0);

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

insert  into `user`(`name`,`passWord`,`fileNum`,`folderNum`,`storageMAX`) values ('admin',NULL,1,5,100),('Alex','',1,0,30),('Chuck','',1,0,30);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
