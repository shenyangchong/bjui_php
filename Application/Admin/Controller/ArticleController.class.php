<?php
namespace Admin\Controller;
use Admin\Controller\AdminController;

/**
 * 文章管理
 * @author Lain
 *
 */
class ArticleController extends AdminController {
	private $categorys;
	//初始化
	public function _initialize(){
		$action = array(
				//'permission'=>array('changePassword'),
				//'allow'=>array('index')
		);
		B('Admin\\Behaviors\\Authenticate', '', $action);
		
		//获取栏目信息
		if(!$this->categorys = F('category_content')){
			D('ArticleCategory')->file_cache();
			$this->categorys = F('category_content');
		}
	}
    public function index(){
    	//取出文章分类
    	//$this->categoryList = list_to_tree($this->categorys,'catid','parentid');
    	foreach ($this->categorys as $key => $category){
    		$data[$key] = $category;
    		$data[$key]['name'] = $category['catname'];
    		if($category['type'] == 0){	//内部栏目, 显示列表
    			$data[$key]['url'] = U('Article/manage?catid='.$category['catid']);
    		}else{		//单网页, 显示编辑页
    			$data[$key]['url'] = U('Article/pageEdit?catid='.$category['catid']);
    			$data[$key]['icon'] = 'Public/images/page_edit.png';
    		}
    	}
    	$nodes = list_to_tree($data, 'catid', 'parentid', 'children');
    	$this->assign('json_nodes', json_encode($nodes));
    	
    	$this->display();
    }
    
    //文章内容管理
    public function manage(){
    	$categorys = $this->categorys;
		//取出所在分类
		$this->catid = $catid = I('get.catid','','intval');
		if(!$catid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'缺少必要的参数'));
		
		// 检索条件
		$map['status'] = 99;
		//取出子集下的文章
		$map['catid'] = array('in', $categorys[$catid]['arrchildid']);
		$map['_string'] = 1;
			
   	 	if(isset($_POST['start_time']) && $_POST['start_time']) {
			$this->start_time = $_POST['start_time'];
			$start_time = strtotime($_POST['start_time']);
			$map['_string'] .= " AND `inputtime` >= '$start_time'";
		}
		if(isset($_POST['end_time']) && $_POST['end_time']) {
			$this->end_time = $_POST['end_time'];
			$end_time = strtotime($_POST['end_time']) + 3600*24;
			$map['_string'] .= " AND `inputtime` <= '$end_time'";
		}

		if(I('post.keyword')) {
            //dump($_POST);exit();
			
			$type_array = array('title','description','username','id');
			$this->keyword = $keyword = I('post.keyword');
			$this->searchtype = $searchtype = I('post.searchtype');
			if($searchtype < 3) {
				$searchArr = $type_array[$searchtype];
				$map[$searchArr] = array('like', "%$keyword%");
			} elseif($searchtype == 3) {//如果传过来的是id，把string类型转换为int类型
				$keyword = intval($_POST['keyword']);
                $searchArr = $type_array[$searchtype];
                $map[$searchArr] = array('like', "%$keyword%");
			}
		}
		//排序
		if(I('post.orderField')){
			$this->orderField = $orderField = I('post.orderField');
			$this->orderDirection = $orderDirection = I('post.orderDirection') ? I('post.orderDirection') : 'asc';
			$order = $orderField . ' ' . $orderDirection;
		}else{
			$order = 'id desc';
		}
		
		// 分页相关
		$page['pageCurrent'] = max(1 , I('post.pageCurrent'));
		$page['pageSize']= I('post.pageSize') ? I('post.pageSize') : 30 ;
		
		$totalCount = D('Article')->where($map)->count();
		$page ['totalCount'] = $totalCount;
		
		// 取数据
		$page_list = D('Article')->where($map)->page($page['pageCurrent'], $page['pageSize'])->order($order)->order("issue desc")->select();
		
		$this->assign('page_list', $page_list);
		$this->assign('page', $page);
		$this->assign('categorys', $categorys);
		$this->display ();
	}

	public function add(){
		$catid = I('get.catid','','intval');
		if(IS_POST){
			$info = I('post.info');
			//后台发布不用审核
			$info['status'] = 99;
			$info['catid'] = $catid;
			
			//验证规则
			$DB = D('Article');
			if(!$DB->create($info)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>$DB->getError()));
			}else{
				$result = $DB->add_content($info);
			}
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'divid'=>'layout_article','message'=>'保存成功'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
			$this->assign('catid', $catid);
			$this->display('edit');
		}
	}
	public function edit(){
		$id = I('get.id','','intval');
		//$this->catid = $catid = I('get.catid','','intval');
		
		//取出该文章信息
		$detail = D('Article')->where('id='.$id)->find();
		if(!$detail){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'文章不存在'));
		}
		
		if(IS_POST){
			//验证规则
			$info = I('post.info');
			if(!D('Article')->create($info, 2)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>D('Article')->getError()));
			}else{
				//$z = new \Admin\Model\ArticleModel();
				//$z->edit_content($info, $id);
				//dump($z);exit();
				
				$result = D('Article')->edit_content($info, $id);
			}
	
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','divid'=>'layout_article'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
			$this->assign('catid', $detail['catid']);
			$this->assign('Detail', $detail);
			$this->assign('categorys',$this->categorys);
			$this->display();
		}
	}
	//批量删除文章
	public function delete(){
		$ids = I('get.ids');  //获取ids字符串  '1130,1127'
		if(!$ids)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'请选择要删除的文章'));
		$idsList = explode(',', $ids);
		//循环删除文章
		foreach ($idsList as $id){
			//删除内容
			D('Article')->delete_content($id);
			//其他相关操作
		}
		$this->ajaxReturn(array('statusCode'=>200,'message'=>'删除成功','divid'=>'layout_article'));
		
	}
	//更改文章发布状态
	public function changeIssue(){
		$ids = I('get.ids');
		if(!$ids){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'请选择要变更的文章'));
		}
		$idsList = explode(',',$ids);
		foreach ($idsList as $key=>$id){
			$info['id']=$id;
			$issue=D('Article')->where('id='.$id)->field('issue')->find();
			//dump($issue['issue']);			
			$new_status = !$issue['issue'];			
			$info['issue']=$new_status+"";
			//更新发布时间
			$info['inputtime']=NOW_TIME;
			D('Article')->where('id='.$id)->save($info);
		}
		//$this->ajaxReturn(array('statusCode'=>200,'message'=>'变更成功！','divid'=>'layout_article'));
		//$this->ajaxReturn(array('statusCode'=>200,'message'=>'变更成功！'));
		$this->ajaxReturn(array('statusCode'=>200,'message' => '变更成功'));
		
	}
	
    //文章分类列表
    public function category(){
    	$tree = new \Lain\Phpcms\tree();
    	$tree->icon = array('&nbsp;&nbsp;&nbsp;│ ','&nbsp;&nbsp;&nbsp;├─ ','&nbsp;&nbsp;&nbsp;└─ ');
    	$tree->nbsp = '&nbsp;&nbsp;&nbsp;';
    	
    	$result = $this->categorys;
    	if(!empty($result)){
    		foreach ($result as $r){
    			$categoryList[$r['catid']] = $r;
    			$categoryList[$r['catid']]['typename'] = $r['type'] == 1 ? '单网页' : '内部栏目';
    			$categoryList[$r['catid']]['str_manage'] = '<a class="btn btn-green" href="'.U('Article/categoryEdit?catid='.$r['catid']).'" data-toggle="dialog" data-width="520" data-height="290" data-id="dialog-mask" data-mask="true">修改</a> <a class="btn btn-green" href="'.U('Article/categoryTemplate?catid='.$r['catid']).'" data-toggle="dialog" data-width="900" data-height="500" data-id="dialog-mask" data-mask="true">设置</a> <a href="'.U('Article/categoryDelete?catid='.$r['catid']).'" class="btn btn-red" data-toggle="doajax" data-confirm-msg="确定要删除该栏目吗？">删</a> ';
    		}
    	}
    	$str  = "<tr target='rid' rel='\$catid'>
    				<td>\$catid</td>
    				<td>\$spacer\$catname</td>
    				<td>\$typename</td>
    				<td>\$listorder</td>
    				<td align='center'>\$str_manage</td>
				</tr>";
    	$tree->init($categoryList);
    	$this->categoryList = $tree->get_tree(0, $str);
    	
    	/* foreach ( $this->categorys as $key => $category ) {
			$data [$key] = $category;
			$data [$key] ['name'] = $category ['catname'];
			$data [$key] ['name'] = $category ['catname'];
			// 如果有子分类的父级, 去掉url
			if ($category ['parentid'] == 0 && $category ['child'] != 0) {
				unset ( $data [$key] ['url'] );
			}
		}
		$nodes = list_to_tree ( $data, 'catid', 'parentid', 'children' );
		$this->assign ( 'json_nodes', json_encode ( $nodes ) ); */
    	
    	$this->display();
    }
    //更新栏目缓存 
    public function categoryCache(){
    	D('ArticleCategory')->public_cache();
    	$this->ajaxReturn(array('statusCode'=>200,'message'=>'更新缓存成功','tabid'=>'Article_category'));
    }
    public function categoryAdd(){
    	if(IS_POST){
    		$DB = D('ArticleCategory');
    		$info = I('post.info');
    		if(!$DB->create($info)){
    			$this->ajaxReturn(array('statusCode'=>300,'message'=>$DB->getError()));
    		}else{
    			$catid = $DB->add($info);
    			//如果是单网页, 则需要添加到page表
    			$data['title'] = $info['catname'];
    			$data['catid'] = $catid;
    			D('Page')->add($data);
    		}
    		if($catid){
    			//更新缓存
    			$DB->public_cache();
    			$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','tabid'=>'Article_category'));
    		}else{
    			$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败。ErrorNo:0003'));
    		}
    	}else{
    		//$form = new \Lain\Phpcms\form();
    		//var_dump(\Lain\Phpcms\form::select_category('',0 , 'class="combox" name="info[parentid]" id="pid"','≡ 作为一级栏目 ≡'));
			//$this->categoryList = $form::select_category('',0 , 'class="combox" name="info[parentid]" id="pid"','≡ 作为一级栏目 ≡');
    		$this->display('categoryEdit');
    	}
    }
    /*
     * 栏目分类编辑
    */
    public function categoryEdit(){

    	$DB = D('ArticleCategory');
    	if(IS_POST){
    		$catid = I('post.catid','','intval');
    		$info = I('post.info');
    		if(!$DB->create($info)){
    			$this->ajaxReturn(array('statusCode'=>300,'message'=>$DB->getError()));
    		}else{
    			$result = $DB->where('catid='.$catid)->save($_POST['info']);
    		}
    		if($result){
    			//更新缓存
    			$DB->public_cache();
    			$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','tabid'=>'Article_category'));
    		}else{
    			$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败。ErrorNo:0003'));
    		}
    	}else{
    		$this->catid = $catid = I('get.catid','','intval');
    		$this->Detail = $DB->where('catid='.$catid)->find();
    		//$form = new \Lain\Phpcms\form();
			//$this->categoryList = $form::select_category('',$this->Detail['parentid'], 'class="combox" name="info[parentid]" id="pid"','≡ 作为一级栏目 ≡');
    		$this->display();
    	}
    }
    
    /**
     * 栏目设置
     */
    public function categoryTemplate(){
    	$catid = I('get.catid');
    	$detail = D('ArticleCategory')->where('catid='.$catid)->field('setting')->find();
    	if(!$detail){
    		$this->ajaxReturn(array('statusCode'=>300,'message'=>'栏目不存在, 或者参数错误'));
    	}
    	if(IS_POST){
    		$setting = I('post.setting');
    		$data['setting'] = serialize($setting);
    		
    		D('ArticleCategory')->where('catid='.$catid)->save($data);
    		//
    		$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功'));
    	}else{
    		$setting = unserialize($detail['setting']);
    		
    		$this->assign('setting', $setting);
    		$this->display();
    	}
    	
    }
    
    /*
     * 删除栏目分类
    */
    public function categoryDelete(){
    	$DB = D('ArticleCategory');
    	$catid = I('get.catid','','intval');
    	if (!$catid)
    		$this->ajaxReturn(array('statusCode'=>300,'message'=>'参数错误'));
    	//判断栏目是否有文章
    	//找出该栏目下的所有子栏目ids，是一位数组
    	$arrchildids= $DB->where('catid='.$catid)->field('arrchildid')->find();
    	foreach ($arrchildids as $key=>$articleid){
    		$map['catid'] = array('in',$articleid);
    		//用where的数组形式，查询出，是否存在文章
    		$article = D('Article')->where($map)->select();
    		if($article){
    			$this->ajaxReturn(array('statusCode'=>300,'message'=>'该分类下存在文章，无法删除！'));
    		}
    		
    		//dump($article);exit();
    	}
    	
    	//删除子栏目
    	$delete_catids = $DB->delete_child($catid);
    	//删除栏目
    	$DB->where('catid='.$catid)->delete();
    	//更新缓存
    	$DB->public_cache();
    	$this->ajaxReturn(array('statusCode'=>200,'message'=>'删除成功','tabid'=>'Article_category'));
    	
    }
    
    //单网页编辑
    public function pageEdit(){
		$catid = I('get.catid','','intval');
		//$this->catid = $catid = I('get.catid','','intval');
		
		//取出该文章信息
		$detail = D('Page')->where('catid='.$catid)->find();
		if(!$detail){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'文章不存在'));
		}
		
		if(IS_POST){
			//验证规则
			$info = I('post.info');
			if(!D('Page')->create($info)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>D('Page')->getError()));
			}else{
				D('Page')->where('catid='.$catid)->save($info);
			}
	
			$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功'));
		}else{
			$this->assign('catid', $detail['catid']);
			$this->assign('Detail', $detail);
			$this->display();
		}
	}
}