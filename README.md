## 简介
----------
- 本系统集成了Thinkphp和B-Jui后台php框架和前台html框架, 让开发人员方便利用现成资源, 来迅速开发自己所需要的功能, 专注于业务功能, 轻松+简单. 
- 演示地址 [http://xiaoshuo.mnsmz.net/admin.php](http://xiaoshuo.mnsmz.net/admin.php "http://xiaoshuo.mnsmz.net/admin.php")
- 账号/密码		admin/123456
- 微信公众号功能演示账号: 一起php



----------

(刚开始用的朋友, 可以快速浏览下目录中的快速入门.doc, 对二次开发的一些简单说明)


## 简洁好用的权限设置, phpcms整合.

系统中加入了管理员控制, 角色控制, 权限控制及和界面有重要关系的菜单控制模块.


 因为经常接触cms的缘故, 所以也把phpcms的文章部分也参照写了进去.这里用到了category表. 个人感觉栏目分类这部分的通用性还是很强的.  当然大家有需要用到就用, 没有用的话, 就隐藏, 删除掉吧. 


## 安装说明

默认下缺少Application/Common/Conf下的config.php数据库配置信息, 可以手动添加, 并手动导入db_thinkphp+bjui.sql数据库, 也可以执行 域名/install.php, 来设置数据库信息. 
前台地址: 	域名/index.php
后台地址:	域名/admin.php(数据包里的默认账号  admin/123456)
安装地址: 	域名/install.php