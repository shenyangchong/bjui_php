/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50540
Source Host           : localhost:3306
Source Database       : db_thinkphp+bjui

Target Server Type    : MYSQL
Target Server Version : 50540
File Encoding         : 65001

Date: 2015-08-29 12:22:59
*/

-- ----------------------------
-- Table structure for `db_book`
-- ----------------------------
DROP TABLE IF EXISTS `db_book`;{}
CREATE TABLE `db_book` (
  `id` smallint(5) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `thumb` varchar(100) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL COMMENT '摘要',
  `gather` varchar(255) DEFAULT NULL COMMENT '采集网站',
  `author` varchar(50) DEFAULT NULL COMMENT '作者',
  `category` varchar(255) DEFAULT NULL COMMENT '分类',
  `chapter_count` smallint(8) DEFAULT NULL,
  `chapter_num` smallint(8) DEFAULT NULL,
  `gid` varchar(20) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `create_time` int(10) DEFAULT NULL,
  `last_chapter_title` varchar(255) DEFAULT NULL COMMENT '最新章节标题',
  `last_chapter_index` mediumint(6) DEFAULT NULL COMMENT '最新章节',
  `last_chapter_update_time` int(10) DEFAULT NULL,
  `last_cron_time` int(10) DEFAULT '0',
  `next_cron_time` int(11) DEFAULT '0' COMMENT '下次任务执行时间',
  `status` tinyint(1) DEFAULT '1' COMMENT '是否连载',
  `is_hot` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;{}

-- ----------------------------
-- Table structure for `db_book_chapter`
-- ----------------------------
DROP TABLE IF EXISTS `db_book_chapter`;{}
CREATE TABLE `db_book_chapter` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `bookid` smallint(5) DEFAULT NULL,
  `chapterid` smallint(5) DEFAULT NULL COMMENT '章节id',
  `title` varchar(100) DEFAULT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `create_time` int(10) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL COMMENT '采集网站',
  `status` tinyint(1) DEFAULT '0' COMMENT '采集状态, 未采集0, 采集1',
  `index` smallint(5) DEFAULT NULL COMMENT '排序',
  `rank` tinyint(1) DEFAULT NULL COMMENT '排序(微调)',
  `cid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22710 DEFAULT CHARSET=utf8;{}



-- ----------------------------
-- Table structure for `db_weixin`
-- ----------------------------
DROP TABLE IF EXISTS `db_weixin`;{}
CREATE TABLE `db_weixin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `openID` varchar(100) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `msgType` varchar(20) DEFAULT NULL,
  `createTime` int(10) DEFAULT NULL,
  `toUserName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;{}

-- ----------------------------
-- Records of db_weixin
-- ----------------------------

-- ----------------------------
-- Table structure for `db_weixin_book`
-- ----------------------------
DROP TABLE IF EXISTS `db_weixin_book`;{}
CREATE TABLE `db_weixin_book` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `toUserName` varchar(100) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
