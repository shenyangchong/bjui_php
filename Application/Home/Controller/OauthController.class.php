<?php
namespace Home\Controller;
use Think\Controller;
class OauthController extends Controller {
	
	public function qq(){
		vendor('QQApi.qqConnectAPI');
		//require_once("../../API/qqConnectAPI.php");
		$qc = new \QC();
		$qc->qq_login();
		
	}
	
	public function callback(){
		
		vendor('QQApi.qqConnectAPI');
		$qc = new \QC();
		$access_token = $qc->qq_callback();
		$openid = $qc->get_openid();
		$data['data'] = serialize(array('access_token' => $access_token, 'openid' => $openid));
		M('post_log')->add($data);
		
		//注册会员信息
		//查看此openid是否存在
		$map['username'] = $openid;
		$detail = D('User')->where($map)->find();
		$userid = $detail['userid'];
		$nickname = $detail['nickname'];
		if(!$detail){
			//获取用户信息
			$arr = $qc->get_user_info();
			M('post_log')->add(array('data' => serialize($arr)));
			$info['username'] = $openid;
			$info['nickname'] = $nickname = $arr['nickname'];
			$userid = D('User')->add($info);
		}

		if($userid){
			//保存session
			session('userid', $userid);
			
			//保存cookie用户信息
			cookie('userid', $userid);
			cookie('nickname', $nickname);
			
			cookie('userid', $userid);
			redirect(U('Shenma/user'));
		}
		
		/* $arr = $qc->get_user_info();
		
		var_dump($arr);exit; */
	}
}