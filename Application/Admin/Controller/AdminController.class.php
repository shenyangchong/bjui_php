<?php
namespace Admin\Controller;
use Think\Controller;
class AdminController extends Controller {
	/**
	 * 后台执行的一些判断
	 */
	public function __construct(){
		parent::__construct();
		self::checkAdmin();
		//self::check_disabled();
		//self::check_priv();
		//self::check_hash();
	}
	/**
	 * 判断用户是否已经登陆
	 */
	public function checkAdmin() {
		//登录界面不判断, Publics控制，不判断
		if(CONTROLLER_NAME =='Publics' || CONTROLLER_NAME =='Cron') {
			return true;
		} else {
			$userid = cookie('userid');
			//没有相关session则跳转到登录页
			if(!session('userid') || !session('roleid') || $userid != session('userid')){
				redirect(U('Publics/login'));
			}
		}
	}
}