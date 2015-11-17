<?php
namespace Admin\Controller;
use Admin\Controller\AdminController;

/**
 * 小说管理
 * @author Lain
 *
 */
class BookController extends AdminController {
	//初始化
	public function _initialize(){
		$action = array(
				//'permission'=>array('changePassword'),
				//'allow'=>array('index')
		);
		B('Admin\\Behaviors\\Authenticate', '', $action);		

	}

	
    //文章内容管理
    public function manage(){		
		// 检索条件			
		if(isset($_POST['start_time']) && $_POST['start_time']) {
				$this->start_time = $_POST['start_time'];
			$start_time = strtotime($_POST['start_time']);
							$sql .= " AND `inputtime` > '$start_time'";
		}
		if(isset($_POST['end_time']) && $_POST['end_time']) {
			$this->end_time = $_POST['end_time'];
			$end_time = strtotime($_POST['end_time']);
			$sql .= " AND `inputtime` < '$end_time'";
		}
		if( ($start_time && $end_time) &&$start_time>$end_time)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'结束时间应该大于开始时间'));
        //按关键
		if(I('post.keyword')) {
			
			$type_array = array('title','description','username');
			$this->keyword = $keyword = I('post.keyword');
			$this->searchtype = $searchtype = I('post.searchtype');
			if($searchtype < 3) {
				$searchtype = $type_array[$searchtype];
				$map[$searchtype] = array('like', "%$keyword%");
			} elseif($searchtype == 3) {
				$keyword = intval($_POST['keyword']);
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
		
		$totalCount = D('Book')->where($map)->count();
		$page ['totalCount'] = $totalCount;
		//dump($map);exit();
		
		// 取数据 
		$map[] = array('is_delete=0');
		$page_list = D('Book')->where($map)->page($page['pageCurrent'], $page['pageSize'])->order($order)->select();
//		dump(D('Book')->getLastSql());exit();
		$this->page_list = $page_list;
		$this->page = $page;
		$this->display ();
	}

	public function add(){
		$bookid = I('get.bookid','','intval');
		if(IS_POST){
			$info = I('post.info');
			//后台发布不用审核
			$info['status'] = 99;
			$info['bookid'] = $bookid;
			$info['create_time']=NOW_TIME;
			
			//验证规则
			$DB = D('Book');
			if(!$DB->create($info)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>$DB->getError()));
			}else{
				$result = $DB->add($info);
			}
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'tabid'=>'Book_manage','message'=>'保存成功'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
			$this->assign('bookid', $bookid);
			$this->display('edit');
		}
	}
	
	
	//搜索百度小说
	public function searchBaidu(){
		if(IS_POST){
			$keyword = I('post.keyword');
			if($keyword){				
				$url = 'http://dushu.baidu.com/ajax/searchresult?word='.urlencode($keyword);
				$content=$this->_curl($url);
			}
		}
		$this->assign('keyword', $keyword);
		$this->assign('page_list', $content['list']);
		$this->display();
	}
	
	//添加小说
	public function addBaidu(){
		$gid = I('get.gid');
		//判断是否采集过, 没有的话, 保存文章信息
		$map_book['gid'] = (int)$gid;
		$exist_book = D('Book')->where($map_book)->find();
		
		if(!$exist_book){
			$url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$gid;
			$content = $this->_curl($url);
			if(!$content || $content['status'] != 1)
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'接口类型错误'));
				
			$data_book['title'] = $content['data']['title'];
			$data_book['summary'] = $content['data']['summary'];
			$data_book['thumb'] = $content['data']['originalCoverImage'];
			$data_book['author'] = $content['data']['author'];
			$data_book['gid'] = $content['data']['gid'];
			$data_book['category'] = $content['data']['category'];
			$data_book['url'] = $content['data']['url'];
			$data_book['create_time'] = NOW_TIME;
			
		
			$bookid = D('Book')->add($data_book);
		}else{
			$this->ajaxReturn(array('statusCode'=>300,'message'=>$exist_book['title'].'已经存在， 不必重复添加'));
		}
		
		if(!$bookid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'添加失败'));
		//判断最新章节
		//取出所有章节
		$group = $content['data']['group'];
		
		$map['bookid'] = $data['bookid'] = $bookid;
		
		//待优化: 查看已采集的章节数量,
		foreach ($group as $chapter){
			//判断是否已经存在
			//$map['chapterid'] = $chapter['index'];
			//$exist_chapter = D('BookChapter')->where($map)->field('id, status')->find();
			//if(!$exist_chapter){
			//不判断，直接保存
			$data['chapterid'] = $chapter['index'];
			$data['cid'] = $chapter['cid'];
			$data['index'] = $chapter['index'];
			$data['rank'] = $chapter['rank'];
			$data['title'] = $chapter['text'];
			$data['url'] = $chapter['href'];
				
			D('BookChapter')->add($data);
			//}
		}
		//更新最后一章信息到Book表
		$last_chapter['last_chapter_title'] = $data['title'];
		$last_chapter['last_chapter_index'] = $data['index'];
		$last_chapter['last_chapter_update_time'] = NOW_TIME;
		D('Book')->where('id='.$bookid)->save($last_chapter);
		$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','tabid'=>'Book_manage'));
	}
	
	public function edit(){
		$id = I('get.id','','intval');
		//$this->bookid = $bookid = I('get.bookid','','intval');
		
		//取出该文章信息
		$map['id'] = $id;
		$detail = D('Book')->where($map)->find();
		if(!$detail){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'文章不存在'));
		}
		
		if(IS_POST){
			//验证规则
			$info = I('post.info');
			$info['last_chapter_update_time'] = NOW_TIME;
			if(!D('Book')->create($info, 2)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>D('Book')->getError()));
			}else{
				$result = D('Book')->where($map)->save($info);
			}
	
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','tabid'=>'Book_manage'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
	
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
		//查看文章是否是空的
		foreach ($idsList as $id){
			//删除内容
			//D('Book')->delete_content($id,$bookid);
			//其他相关操作
		}
		
		//循环删除文章
		foreach ($idsList as $id){
			//删除内容
			
			//D('Book')->where('id='.$id)->delete();
			//改成只跟变状态
			$info['is_delete'] = 1;
			D('Book')->where('id='.$id)->save($info);
			//删除章节
			D('BookChapter')->where('bookid='.$id)->save($info);
			//其他相关操作
			
		}
		$this->ajaxReturn(array('statusCode'=>200,'message'=>'删除成功','tabid'=>'Book_manage'));
		
	}
    
	//查看文章章节
	public function chapterManage(){
		$bookid = I('get.bookid');
		if(!$bookid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'缺少必要的参数'));
		// 检索条件
		$map['bookid'] = $bookid;
		if(isset($_POST['start_time']) && $_POST['start_time']) {
			$this->start_time = $_POST['start_time'];
			$start_time = strtotime($_POST['start_time']);
			$sql .= " AND `inputtime` > '$start_time'";
		}
		if(isset($_POST['end_time']) && $_POST['end_time']) {
			$this->end_time = $_POST['end_time'];
			$end_time = strtotime($_POST['end_time']);
			$sql .= " AND `inputtime` < '$end_time'";
		}
		if( ($start_time && $end_time) &&$start_time>$end_time)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'结束时间应该大于开始时间'));
		
		if(I('post.keyword')) {
				
			$type_array = array('title','description','username');
			$this->keyword = $keyword = I('post.keyword');
			$this->searchtype = $searchtype = I('post.searchtype');
			if($searchtype < 3) {
				$searchtype = $type_array[$searchtype];
				$map[$searchtype] = array('like', "%$keyword%");
			} elseif($searchtype == 3) {
				$keyword = intval($_POST['keyword']);
			}
		}
		//排序
		if(I('post.orderField')){
			$this->orderField = $orderField = I('post.orderField');
			$this->orderDirection = $orderDirection = I('post.orderDirection') ? I('post.orderDirection') : 'asc';
			$order = $orderField . ' ' . $orderDirection;
		}else{
			$order = '`index`,rank desc';
		}
		
		// 分页相关
		$page['pageCurrent'] = max(1 , I('post.pageCurrent'));
		$page['pageSize']= I('post.pageSize') ? I('post.pageSize') : 30 ;
		
		$totalCount = D('BookChapter')->where($map)->count();
		$page ['totalCount'] = $totalCount;
		
		// 取数据
		$map[] = array('is_delete=0');
		$page_list = D('BookChapter')->where($map)->page($page['pageCurrent'], $page['pageSize'])->order($order)->select();
//		dump(D('BookChapter')->getLastSql());exit();
		$this->assign('bookid', $bookid);
		$this->page_list = $page_list;
		$this->page = $page;
		$this->display ();
	}
	
	public function chapterAdd(){
		$bookid = I('get.bookid','','intval');
		if(!$bookid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'缺少必要的参数'));
		if(IS_POST){
			$info = I('post.info');
			
			$info['bookid'] = $bookid;
			$info['create_time'] = NOW_TIME;
				
			//验证规则
			$DB = D('BookChapter');
			if(!$DB->create($info)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>$DB->getError()));
			}else{
				$result = $DB->add($info);
				//更新文章的最新章节
				$bookinfo['chapterid'] = $result;
				$bookinfo['chapter_title'] = $info['title'];
				D('Book')->where('bookid='.$bookid)->save($bookinfo);
			}
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'tabid'=>'Book_chapterManage','message'=>'保存成功'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
			$this->assign('bookid', $bookid);
			$this->display('chapterEdit');
		}
	}
	public function chapterEdit(){
		$id = I('get.id','','intval');
		$bookid = I('get.bookid','','intval');
		if(!$bookid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'缺少必要的参数'));
		//$this->bookid = $bookid = I('get.bookid','','intval');
	
		//取出该章节信息
		$map['id'] = $id;
		$detail = D('BookChapter')->where($map)->find();
		if(!$detail){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'文章不存在'));
		}
	
		if(IS_POST){
			//验证规则
			$info = I('post.info');
			if(!D('BookChapter')->create($info, 2)){
				//如果不通过 ，输出错误报告
				$this->ajaxReturn(array('statusCode'=>300,'message'=>D('Book')->getError()));
			}else{
				$result = D('BookChapter')->where($map)->save($info);
			}
	
			if($result){
				$this->ajaxReturn(array('statusCode'=>200,'closeCurrent'=>true,'message'=>'保存成功','tabid'=>'Book_chapterManage'));
			}else{
				$this->ajaxReturn(array('statusCode'=>300,'message'=>'保存失败ERROR:003'));
			}
		}else{
	
			$this->assign('Detail', $detail);
			//var_dump($detail);
			$this->display();
		}
	}
	
	public function chapterDelete(){
		$ids=I('get.ids');
		
		if(!$ids)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'请选择要删除的章节'));
		$idsList = explode(',', $ids);
		foreach ($idsList as $id){
			//删除内容
				
			//D('Book')->where('id='.$id)->delete();
			//改成只跟变状态
			$info['is_delete'] = 1;
			//D('Book')->where('id='.$id)->save($info);
			//删除章节
			
			D('BookChapter')->where('id='.$id)->save($info);
			
			//其他相关操作
				
		}
		//dump(D('BookChapter')->getLastSql());exit();
		
		$this->ajaxReturn(array('statusCode'=>200,'message'=>'删除成功','tabid'=>'Book_chaptermanage'));
	}
	
	public function gather(){
		$bookid = I('get.bookid');
		$gid = D('Book')->where('id='.$bookid)->getField('gid');
		if(!$gid)
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'文章不存在'));
		$url = $this->getBookJs($gid);
		
		$content = json_decode(\Org\Net\Http::fsockopenDownload($url), true);
		

		if(!$content || $content['status'] != 1){
			$this->ajaxReturn(array('statusCode'=>300,'message'=>'采集失败'));
		}
		//判断是否采集过, 没有的话, 保存文章信息
		//判断最新章节
		//取出所有章节
		//dump($content);exit();
		$group = $content['data']['group'];
		//echo json_encode($group[199]);exit;
		$map['bookid'] = $data['bookid'] = $bookid;
		
		//待优化: 查看已采集的章节数量, 
		
		$count_chapter = D('BookChapter')->where('bookid='.$bookid)->count();
		if($count_chapter < count($group)){
			foreach ($group as $k => $chapter){
					
				if($k < $count_chapter)
					continue;
				//判断是否已经存在
				$map['chapterid'] = $chapter['index'];
				$exist_chapter = D('BookChapter')->where($map)->field('id, status')->find();
				if(!$exist_chapter){
					//保存
					$data['chapterid'] = $chapter['index'];
					$data['cid'] = $chapter['cid'];
					$data['index'] = $chapter['index'];
					$data['rank'] = $chapter['rank'];
					$data['title'] = $chapter['text'];
					$data['url'] = $chapter['href'];
			
					D('BookChapter')->add($data);
				}
			}
			
			//更新最后一章信息到Book表
			$last_chapter['last_chapter_title'] = $data['title'];
			$last_chapter['last_chapter_index'] = $data['index'];
			$last_chapter['last_chapter_update_time'] = NOW_TIME;
			D('Book')->where('id='.$bookid)->save($last_chapter);
		}
		
		
		//取出地址中返回的章节
		$this->ajaxReturn(array('statusCode'=>200,'message'=>'采集成功','tabid'=>'Book_manage'));
	}
	
	public function gatherChapter(){
		
    	if(IS_POST){
    		$bookid = I('get.bookid');
    		$chapterid = $_GET['chapterid'] ? intval($_GET['chapterid']) : 0;	//要采集的章节
    		
    		//获取要采集的章节
    		$map['bookid'] = $bookid;
    		$map['status'] = 0;
    		$map['chapterid'] = array('gt', $chapterid);
    		
    		$detail_chapter = D('BookChapter')->where($map)->order('`index`, rank DESC')->find();
    		
    		//执行采集动作
    		//拼凑采集地址
    		$gid = D('Book')->where('id='.$bookid)->getField('gid');
    		$url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$gid.'&pageType=undefined&src='.$detail_chapter['url'].'&cid='.$detail_chapter['cid'].'&time=&skey=&id=wisenovel';
    		
    		
    		$ch = curl_init();
    		curl_setopt($ch, CURLOPT_URL, $url);
    		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    		$txt = curl_exec($ch);
    		if (curl_errno($ch)) {
    			//trace(curl_error($ch) , '升级通知出错', 'NOTIC', true);
    		
    			return false;
    		}
    		curl_close($ch);
    		$content = json_decode($txt, true);
    		if (!$content) {
    			//trace('接口[' . $url . ']返回格式不正确', '升级通知出错', 'NOTIC', true);
    		
    			return false;
    		}
    		//$content = json_decode(\Org\Net\Http::fsockopenDownload($url, array('timeout' => '5')), true);
    		if($content && $content['status'] == 1){
    			//保存内容
    			$chapter = $content['data'][0] ? $content['data'][0] : $content['data'];
    			$data['content'] = $chapter['content'];
    			$data['create_time'] = NOW_TIME;
    			$data['status'] = 1;	//更新状态

    			D('BookChapter')->where('id='.$detail_chapter['id'])->save($data);
    		}
    		//取出下一篇文章
    		$map['chapterid'] = array('gt', $detail_chapter['chapterid']);
    		$next_chapter = D('BookChapter')->where($map)->order('`index`, rank DESC')->find();
    		
    		if ($next_chapter) {
    			echo '<meta charset="utf-8"><script type="text/javascript">window.parent.addtext("<li>'.$detail_chapter['title'].' 采集成功..........</li>");</script>';
    			echo '<script language="javascript">setTimeout("window.location.href=\''.U('Book/gatherChapter?bookid='.$bookid.'&chapterid='.$detail_chapter['chapterid']).'\';",0);</script>';
    		} else {
    			echo '<meta charset="utf-8"><script type="text/javascript">window.parent.addtext("<li>'.$detail_chapter['title'].' 采集成功..........</li><li style=\"color: red;\">全部更新成功</li>")</script>';
    		}
    	}else{
    		$this->display();
    	}
    	
    }
    
    //返回形如 http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid=3961103225
    public function getBookJs($url){
    	if(is_numeric($url)){
    		$gid = $url;
    	}else{
    		$test = parse_url($url);
    		$query = explode('&', $test['query']);
    		foreach ($query as $v){
    			$param = explode('=', $v);
    		
    			$param_list[$param[0]] = $param[1];
    		}
    		
    		$gid = $param_list['gid'];
    	}
    	
    	
    	//没有gid字段, 返回错误
    	if(!$gid)
    		return false;
    	
    	$new_url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$gid;
    	return $new_url;
    }
    
    public function searchBook(){
    	$keyword = I('post.keyword');
    	if($keyword){
	    	$url = 'http://dushu.baidu.com/ajax/searchresult?word='.urlencode($keyword);
	    	$content=$this->_curl($url);
// 	    	$ch = curl_init();
// 	    	curl_setopt($ch, CURLOPT_URL, $url);
// 	    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// 	    	$txt = curl_exec($ch);
// 	    	if (curl_errno($ch)) {
// 	    		return false;
// 	    	}
// 	    	curl_close($ch);
// 	    	$content = json_decode($txt, true);
	    	
	    	//var_dump($content['list'][0]);
	    	/* if($content['list']){
	    		$num = 1;
	    		foreach ($content['list'] as $v){
	    			if($v['book_type'] != 1)
	    				continue;
	    			
	    			$str = $num . '、'.strip_tags ($v['book_name'])."\n--作者：".$v['author']."\n--简介:".substr($v['summary'], 0, 40);
	    			$contentStr .= $contentStr ? "\n\n".$str : $str;
	    			$data_weixin_book[$num] = $v['book_id']; 	//保存书号
	    			$num ++;
	    		}
	    	
	    		return $contentStr;
	    	}else{
	    		return false;
	    	} */
    	}
    	$this->assign('keyword', $keyword);
    	$this->assign('page_list', $content['list']);
    	$this->display();
    }
    
    public function _curl($url){
    	$ch = curl_init();//初始一个url会话
    	//设置一个cURL传输选项,需要获取的URL地址，也可以在 curl_init() 函数中设置。
    	curl_setopt($ch, CURLOPT_URL, $url);
    	//CURLOPT_RETURNTRANSFER   将 curl_exec() 获取的信息以文件流的形式返回，而不是直接输出。
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    	$txt = curl_exec($ch);
    	if (curl_errno($ch)) {//curl_errno — 返回最后一次的错误号
    		return false;
    	}
    	curl_close($ch);
    	return json_decode($txt, true);
    }
}