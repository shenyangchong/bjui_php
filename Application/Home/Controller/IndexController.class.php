<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
	public function index(){
		$demo = hash_hmac('sha256','123456', 'admin');
		var_dump($demo);
		$demo = hash_hmac('sha256',$demo, 'demo');
		var_dump($demo);
	}
	
	public function getRemark(){
		$menus = M('admin_menu')->select();
		
		foreach($menus as $menu){
			if(!$menu['remark'])
				$this->updateRemark($menu['id']);
		}
	}
	
	public function updateRemark($menuid){
		$detail = M('admin_menu')->where('id='.$menuid)->find();
		//如果已经有备注, 则直接返回
		if($detail['remark'])
			return $detail['remark'];
		//取出上一级的remark
		if($detail['parentid'] == 0){
			//如果此级就是父级, 则remark等于自己的名字
			M('admin_menu')->where('id='.$menuid)->save(array('remark' => $detail['name']));
			return $detail['name'];
		}else{
			//如果有父级, 则, remark = 父级的remark+此级的名字
			$parent_remark = $this->updateRemark($detail['parentid']);
			$remark = $parent_remark . '-' . $detail['name'];
			M('admin_menu')->where('id='.$menuid)->save(array('remark' => $remark));
			return $remark;
		}
	}
	
    public function article(){
    	$id = I('get.id');
    	echo $id;
    }
    
    public function demo(){
    	$this->display();
    }
    
    public function test(){
    	echo 100;
    }
    public function ajax(){
    	echo 'success';
    }
}