/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50538
Source Host           : localhost:3306
Source Database       : db_thinkphp+bjui

Target Server Type    : MYSQL
Target Server Version : 50538
File Encoding         : 65001

Date: 2015-07-13 15:25:19
*/

SET FOREIGN_KEY_CHECKS=0;{}

-- ----------------------------
-- Table structure for `db_admin`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin`;{}
CREATE TABLE `db_admin` (
  `userid` mediumint(6) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `roleid` smallint(5) DEFAULT '0',
  `encrypt` varchar(6) DEFAULT NULL,
  `lastloginip` varchar(15) DEFAULT NULL,
  `lastlogintime` int(10) unsigned DEFAULT '0',
  `email` varchar(40) DEFAULT NULL,
  `realname` varchar(50) NOT NULL DEFAULT '',
  `card` varchar(255) NOT NULL,
  `lang` varchar(6) NOT NULL,
  PRIMARY KEY (`userid`),
  KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;{}


-- ----------------------------
-- Table structure for `db_admin_icon`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin_icon`;{}
CREATE TABLE `db_admin_icon` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `class` varchar(20) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=MyISAM AUTO_INCREMENT=597 DEFAULT CHARSET=utf8;{}
-- ----------------------------
-- Table structure for `db_admin_menu`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin_menu`;{}
CREATE TABLE `db_admin_menu` (
  `id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(40) NOT NULL DEFAULT '' COMMENT '菜单名',
  `icon` varchar(20) DEFAULT NULL COMMENT '图标',
  `parentid` smallint(6) NOT NULL DEFAULT '0',
  `remark` varchar(100) DEFAULT NULL COMMENT '菜单描述',
  `m` char(20) NOT NULL DEFAULT '',
  `c` char(20) NOT NULL DEFAULT '' COMMENT 'Class名',
  `a` char(20) NOT NULL DEFAULT '' COMMENT 'Action名',
  `data` char(100) NOT NULL DEFAULT '',
  `listorder` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `display` enum('1','0') NOT NULL DEFAULT '1',
  `project1` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `project2` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `project3` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `project4` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `project5` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `listorder` (`listorder`),
  KEY `parentid` (`parentid`),
  KEY `module` (`m`,`c`,`a`)
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;{}
-- ----------------------------
-- Records of db_admin_menu
-- ----------------------------
INSERT INTO `db_admin_menu` VALUES ('1', '文章管理', 'book', '0', '文章管理', 'Admin', 'Article', '', '', '50', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('2', '附件管理', null, '0', '附件管理', 'Admin', 'Attachments', '', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('3', '系统设置', null, '0', '系统设置', 'Admin', 'System', '', '', '100', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('4', '管理员设置', 'user-md', '3', '系统设置-管理员设置', 'Admin', 'System', '', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('5', '菜单设置', 'list-ol', '3', '系统设置-菜单设置', 'Admin', 'System', '', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('30', '添加角色', null, '7', '系统设置-管理员设置-角色列表-添加角色', 'Admin', 'System', 'adminRoleAdd', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('7', '角色列表', null, '4', '系统设置-管理员设置-角色列表', 'Admin', 'System', 'adminRoleList', '', '20', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('8', '菜单列表', null, '5', '系统设置-菜单设置-菜单列表', 'Admin', 'System', 'adminNodeLists', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('9', '内容管理', null, '37', '文章管理-文章管理-内容管理', 'Admin', 'Article', 'index', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('10', '附件列表', null, '2', '附件管理-附件列表', 'Admin', 'Attachments', 'Index', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('11', '栏目管理', null, '37', '文章管理-文章管理-栏目管理', 'Admin', 'Article', 'category', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('15', '修改菜单', null, '8', '系统设置-菜单设置-菜单列表-修改菜单', 'Admin', 'Syetem', 'adminNodeEdit', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('16', '删除菜单', null, '8', '系统设置-菜单设置-菜单列表-删除菜单', 'Admin', 'System', 'adminNodeDelete', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('14', '添加菜单', null, '8', '系统设置-菜单设置-菜单列表-添加菜单', 'Admin', 'System', 'adminNodeAdd', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('17', '管理员管理', 'users', '4', '系统设置-管理员设置-管理员管理', 'Admin', 'System', 'adminManage', '', '10', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('18', '选择栏目', null, '9', '文章管理-文章管理-内容管理-选择栏目', 'Admin', 'Article', 'manage', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('19', '添加内容', null, '18', '文章管理-文章管理-内容管理-选择栏目-添加内容', 'Admin', 'Article', 'add', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('20', '编辑内容', null, '18', '文章管理-文章管理-内容管理-选择栏目-编辑内容', 'Admin', 'Article', 'edit', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('21', '删除内容', null, '18', '文章管理-文章管理-内容管理-选择栏目-删除内容', 'Admin', 'Article', 'delete', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('22', '添加栏目', null, '11', '文章管理-文章管理-栏目管理-添加栏目', 'Admin', 'Article', 'CategoryAdd', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('23', '编辑栏目', null, '11', '文章管理-文章管理-栏目管理-编辑栏目', 'Admin', 'Article', 'CategoryEdit', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('24', '删除栏目', null, '11', '文章管理-文章管理-栏目管理-删除栏目', 'Admin', 'Article', 'CategoryDelete', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('25', '更新栏目缓存', null, '11', '文章管理-文章管理-栏目管理-更新栏目缓存', 'Admin', 'Article', 'CategoryCache', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('26', '添加管理员', null, '17', '系统设置-管理员设置-管理员管理-添加管理员', 'Admin', 'System', 'adminAdd', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('27', '修改管理员', null, '17', '系统设置-管理员设置-管理员管理-修改管理员', 'Admin', 'System', 'adminEdit', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('28', '重置密码', null, '17', '系统设置-管理员设置-管理员管理-重置密码', 'Admin', 'System', 'adminResetPassword', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('29', '删除管理员', null, '17', '系统设置-管理员设置-管理员管理-删除管理员', 'Admin', 'System', 'adminDelete', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('31', '禁用角色', null, '7', '系统设置-管理员设置-角色列表-禁用角色', 'Admin', 'System', 'adminRoleForbid', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('32', '权限设置', null, '7', '系统设置-管理员设置-角色列表-权限设置', 'Admin', 'System', 'adminPrivSetting', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('33', '修改角色', null, '7', '系统设置-管理员设置-角色列表-修改角色', 'Admin', 'System', 'adminRoleEdit', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('34', '删除角色', null, '7', '系统设置-管理员设置-角色列表-删除角色', 'Admin', 'System', 'adminRoleDelete', '', '0', '0', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('37', '文章管理', 'book', '1', '文章管理-文章管理', '', 'Article', '', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('40', '邮件管理', 'envelope-o', '0', null, '', 'Email', '', '', '60', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('41', '邮件管理', 'envelope-o', '40', null, '', 'Email', '', '', '0', '1', '1', '1', '1', '1', '1');{}
INSERT INTO `db_admin_menu` VALUES ('42', '邮件测试', '', '41', null, '', 'Email', 'index', '', '0', '1', '1', '1', '1', '1', '1');{}

-- ----------------------------
-- Table structure for `db_admin_role`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin_role`;{}
CREATE TABLE `db_admin_role` (
  `roleid` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `rolename` varchar(20) NOT NULL DEFAULT '',
  `pid` smallint(6) unsigned NOT NULL DEFAULT '0',
  `disabled` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`roleid`),
  KEY `pid` (`pid`),
  KEY `status` (`disabled`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='后台角色表';{}

-- ----------------------------
-- Records of db_admin_role
-- ----------------------------
INSERT INTO `db_admin_role` VALUES ('1', '超级管理员', '0', '1', '');{}
INSERT INTO `db_admin_role` VALUES ('2', '编辑人员', '0', '1', '网站编辑人员1');{}

-- ----------------------------
-- Table structure for `db_admin_role_priv`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin_role_priv`;{}
CREATE TABLE `db_admin_role_priv` (
  `roleid` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `menuid` int(5) DEFAULT NULL,
  `m` char(20) NOT NULL,
  `c` char(20) NOT NULL,
  `a` char(20) NOT NULL,
  `data` char(30) NOT NULL DEFAULT '',
  KEY `roleid` (`roleid`,`m`,`c`,`a`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;{}

-- ----------------------------
-- Table structure for `db_admin_times`
-- ----------------------------
DROP TABLE IF EXISTS `db_admin_times`;{}
CREATE TABLE `db_admin_times` (
  `username` char(40) NOT NULL,
  `ip` char(15) NOT NULL,
  `logintime` int(10) unsigned NOT NULL DEFAULT '0',
  `isadmin` tinyint(1) NOT NULL DEFAULT '0',
  `times` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`username`,`isadmin`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;{}


-- ----------------------------
-- Table structure for `db_article`
-- ----------------------------
DROP TABLE IF EXISTS `db_article`;{}
CREATE TABLE `db_article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `catid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '一级分类',
  `url` char(100) NOT NULL COMMENT 'url地址',
  `title` varchar(64) NOT NULL,
  `img` varchar(128) NOT NULL,
  `thumb` varchar(128) NOT NULL COMMENT '缩略图',
  `description` mediumtext NOT NULL COMMENT '文章描述',
  `content` mediumtext NOT NULL,
  `views` int(10) unsigned NOT NULL DEFAULT '0',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '文章状态',
  `username` char(20) DEFAULT NULL COMMENT '发布人',
  `inputtime` int(10) unsigned NOT NULL COMMENT '创建时间',
  `updatetime` int(10) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `title` (`title`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=1178 DEFAULT CHARSET=utf8 COMMENT='文章表';{}

-- ----------------------------
-- Table structure for `db_article_category`
-- ----------------------------
DROP TABLE IF EXISTS `db_article_category`;{}
CREATE TABLE `db_article_category` (
  `catid` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `siteid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `module` varchar(15) NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `modelid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `parentid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `arrparentid` varchar(255) NOT NULL,
  `child` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `arrchildid` mediumtext NOT NULL,
  `catname` varchar(30) NOT NULL,
  `style` varchar(5) NOT NULL,
  `image` varchar(100) NOT NULL,
  `description` mediumtext NOT NULL,
  `parentdir` varchar(100) NOT NULL,
  `catdir` varchar(30) NOT NULL,
  `url` varchar(100) NOT NULL,
  `items` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `hits` int(10) unsigned NOT NULL DEFAULT '0',
  `setting` mediumtext NOT NULL,
  `listorder` smallint(5) unsigned NOT NULL DEFAULT '0',
  `ismenu` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `sethtml` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `letter` varchar(30) NOT NULL,
  `usable_type` varchar(255) NOT NULL,
  PRIMARY KEY (`catid`),
  KEY `module` (`module`,`parentid`,`listorder`,`catid`),
  KEY `siteid` (`siteid`,`type`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;{}

-- ----------------------------
-- Table structure for `db_attachment`
-- ----------------------------
DROP TABLE IF EXISTS `db_attachment`;{}
CREATE TABLE `db_attachment` (
  `aid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module` char(15) NOT NULL,
  `catid` smallint(5) unsigned NOT NULL DEFAULT '0',
  `viewhost` char(100) NOT NULL,
  `savename` char(50) NOT NULL,
  `savepath` char(200) NOT NULL,
  `filename` char(50) NOT NULL,
  `filepath` char(200) NOT NULL,
  `filesize` int(10) unsigned NOT NULL DEFAULT '0',
  `fileext` char(10) NOT NULL,
  `isimage` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `isthumb` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `downloads` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `userid` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `uploadtime` int(10) unsigned NOT NULL DEFAULT '0',
  `uploadip` char(15) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `authcode` char(32) NOT NULL,
  `siteid` smallint(5) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`aid`),
  KEY `authcode` (`authcode`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;{}

-- ----------------------------
-- Table structure for `db_book`
-- ----------------------------
DROP TABLE IF EXISTS `db_book`;{}
CREATE TABLE `db_book` (
  `id` smallint(5) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `thumb` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;{}

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
  `createtime` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;{}

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
  `toUserName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;{}