<?php
namespace Home\Controller;
use Think\Controller;
class XiaoshuoController extends Controller {
	
	public function index(){
		$pagesize = 10;
		$page = max(1, I('get.p'));
		
		//取出现有书籍
		$page_list = D('Book')->where($map)->page($page, $pagesize)->select();
		$count = D('Book')->where($map)->count();
		$Page       = new \Think\PageBook($count, $pagesize);// 实例化分页类 传入总记录数和每页显示的记录数
		
		$this->assign('page_list', $page_list);
		$this->assign('pages', $Page->show());
		$this->display();
	}
	
	public function info(){
		$bookid = I('get.bookid');
		$detail = D('Book')->where('id='.$bookid)->find();
		if(!$detail)
			$this->error('查无此文章');
		
		//取出列表
		$map['bookid'] = $bookid;
		$chapter_list = D('BookChapter')->where($map)->order('`index`, rank DESC')->field('title AS text, `index`, rank')->select();
		
		//取出前10章
		$firstPage = D('BookChapter')->where($map)->order('`index`, rank DESC')->field('title AS text, `index`, rank')->limit(10)->select();
		
		//倒叙前10章
		$revertFirstPage = D('BookChapter')->where($map)->order('`index` DESC, rank DESC')->limit(10)->select();
		//拼凑js_front
		$js_front['gid'] = $detail['gid'];
		$js_front['cpid'] = '';
		$js_front['src'] = 'http://www.aszw.com/book/3/3008/';
		$js_front['pu'] = 'usm@2,sz@224_220,ta@iphone___3_537';
		$js_front['nocache'] = '';
		$js_front['initargs'] = array(
				'appui'	=> 'alaxs',
		);
		$js_front['params'] = array(
				'gid' => $detail['gid'],
		);
		$js_front['url'] = 'http://www.aszw.com/book/3/3008/';
		
		
		$js_front['firstPage'] = $firstPage;
		$js_front['revertFirstPage'] = $revertFirstPage;
		$js_front['isTemplateRender'] = true;
		$js_front['isGenuine'] = '';
		$this->assign('js_front', json_encode($js_front));
// 		$this->assign('chapter_list', $chapter_list);
// 		$this->assign('bookid', $bookid);
// 		$this->assign('Detail', $detail);
		$this->display();
	}
	
	public function view(){
		
		
		$bookid = I('get.bookid');
		$id = I('get.id');

		//取出文章信息
		$detail = D('Book')->where('id='.$bookid)->find();
		if(!$detail)
			$this->error('查无此文章');
		
		//取出章节
		$map['bookid'] = $bookid;
		$map['id'] = $id;
		$detail_chapter = D('BookChapter')->where($map)->find();
		//判断是否已经采集
		if(!$detail_chapter['content']){
			$url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$detail['gid'].'&pageType=undefined&src='.$detail_chapter['url'].'&cid='.$detail_chapter['cid'].'&time=&skey=&id=wisenovel';
			
			
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
				$detail_chapter['content'] = $data['content'] = $chapter['content'];
				$data['create_time'] = NOW_TIME;
				$data['status'] = 1;	//更新状态
			
				D('BookChapter')->where('id='.$detail_chapter['id'])->save($data);
			}
		}
		
		//判断来源页, 如果是当前目录下请求, 则返回ajax
		if($this->returnAjax()){
				
			$data['data']['content'] = $detail_chapter['content'];
			$data['info'] = '获取文章内容成功';
			$data['status'] = 1;
			$data['url'] = '';
			$this->ajaxReturn($data);
		}
		
		//取出列表
		$map_list['bookid'] = $bookid;
		$chapter_list = D('BookChapter')->where($map_list)->order('`index`, rank DESC')->select();
		
		$this->assign('Detail', $detail);
		$this->assign('detail_chapter', $detail_chapter);
		$this->assign('chapter_list', $chapter_list);
		$this->assign('bookid', $bookid);
		$this->display();
	}
	
	public function ajax_collection_lists(){
		$data['data'] = array();
		$data['info'] = '加载成功';
		$data['status'] = 1;
		$data['url'] = "";
		$this->ajaxReturn($data);
		//echo '{"data":[],"info":"\u6536\u85cf\u6807\u8bc6","status":1,"url":""}';
	}
	
	//判断是否返回ajax
	public function returnAjax(){
		$referer = $_SERVER['HTTP_REFERER'];
		if(!$referer)
			return false;
		//如果来源页是info, 则返回false
		$parse = parse_url($referer);
		$arr_path = explode('/', $parse['path']);
		if(in_array('info', $arr_path))
			return false;
		
		return true;
	}
	
	public function ajax_getImage(){
		
	}
	
	public function ajax_getInfo(){
		//返回文章详情
		$gid = I('get.gid');
		
		//取出该gid的文章详情
		$detail = D('Book')->where('gid='.$gid)->find();
		//取出章节
		
		$chapter_list = D('BookChapter')->where('bookid='.$detail['id'])->order('`index`, rank DESC')->field('index, rank, title AS text, cid')->select();
		
		$detail['group'] = $chapter_list;
		$return['data'] = $detail;
		$return['status'] = 1;
		
		$this->ajaxReturn($return);
		
	}
}