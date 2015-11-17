<?php 
/*
 * 后台管理员模型
 */
namespace Admin\Model;
use Think\Model;
class AdminModel extends Model {
	
	//管理员账号验证规则
	protected $_validate = array(
			array('username','require','用户名必须！'), //默认情况下用正则进行验证
	);
	/*
	 * 登录验证部分
	 * @garam 验证码/密码
	 * @return
	 *  1用户名错误 
	 *  2账号禁用
	 *  3密码错误
	 *  
	 */
	public function login($username, $password, $randomKey) {
		//检测用户名
		$map['username'] = $username;
		$detail = $this->where($map)->find();
		if (! $detail)
			return -1;
		
		//验证密码
		
		if (hash_hmac('sha256', $detail['password'], $randomKey) == $password){
			//更新登录时间
			return $detail;
		} else
			return -3;
	}
	
	/**
	 * 修改密码
	 * @param unknown $userid 	用户ID
	 * @param unknown $password	密码
	 * @return boolean
	 */
	public function edit_password($userid, $password){

		$userid = intval($userid);
		if($userid < 1) return false;
		if(!is_password($password))
		{
			return false;
		}
		$passwordinfo = password($password);
		return $this->where('userid='.$userid)->save($passwordinfo);
		
	}
}
