<?php
namespace Home\Controller;
use Think\Controller;
class ShenmaController extends Controller {
	public $cookie_time;
	public function _initialize(){
		$this->cookie_time = 3600*24*30;	//cookie存1一个月
	}
	public function index(){
		$pagesize = 20;
		$map = '';
		//取出现有书籍, 多取出一条数据, 用来判断是否可以加载更多
		$page_list = D('Book')->where($map)->limit(0, $pagesize + 1)->order('create_time DESC')->select();
		//取出续读
		$xudu = cookie('xudu');
		if($xudu){
			$bookids = '';
			foreach ($xudu as $bookid => $index){
				$bookids .= $bookids ? ','.$bookid : $bookid;
			}
			//取出续读中的文章信息
			$map_xudu['id'] = array('in', $bookids);
			
			$xudu_list = D('Book')->where($map)->index('id')->select();
		}
		
		$this->assign('xudu', $xudu);
		$this->assign('page_list', $page_list);
		$this->assign('xudu_list', $xudu_list);
		$this->display();
	}
	
	public function ajax_list(){
		if(IS_POST){
			$pagesize = 20;
			$offset = I('post.offset');
			$html = '';
			//取出现有书籍
			$page_list = D('Book')->where($map)->limit($offset, $pagesize+1)->order('create_time DESC')->select();
			if($page_list){
				foreach($page_list as $num => $item){
					if($num == $pagesize){
						$next_page = true;
						break;
					}
					$html .= '<dl>
                    <dt>
                        <a href="'.U('info?bookid='.$item[id]).'">'.$item['title'].'</a>
                    </dt>
                    <dd class="pic">
                        <a href="'.U('info?bookid='.$item[id]).'"><img src="'.$item['thumb'].'" alt="'.$item['title'].'"></a>
                    </dd>
                    <dd class="auther">作者：'.$item['author'].'</dd>
                    <dd class="info">简介：'.mb_substr($item[summary],0,50,"utf-8").'</dd>
                    <dd class="text">
                        <span>最新章节: '.date('Y-m-d H:i:s', $item['last_chapter_update_time']).' </span><a href="'.U('view?bookid='.$item[id].'&index='.$item[last_chapter_index]).'">'.$item['last_chapter_title'].'</a>
                    </dd>
                    <dd class="text">
                        <a href="'.U('view?bookid='.$item[id].'&index=1').'">【开始阅读】</a>
                    </dd>
                </dl>';
				}
			}
			//是否有下一页
			if($next_page){
				$html .= '<script>$(function(){$("div.button-last_text_time").html("<a href=\"javascript:add_more(3,'.($offset+$pagesize).',\'sales\');\" >点击加载更多小说</a>");});</script>';
			}else{
				$html .= '	<script>$(function(){$("div.button-last_text_time").hide();});</script>';
			}
			
			
			echo $html;exit;
		}
	}
	
	public function info(){
		$bookid = I('get.bookid');
		$detail = D('Book')->where('id='.$bookid)->find();
		if(!$detail)
			$this->error('无此文章');
		
		//取出列表
		$map['bookid'] = $bookid;
		//取出前20章
		$firstPage = D('BookChapter')->where($map)->order('`index`, rank DESC')->field('title, `index`, rank')->limit(20)->select();
		//取出续读
		$xudu = cookie('xudu');
		if(!$xudu || !$xudu[$bookid]){
			$xudu_id = 1;
		}else{
			$xudu_id = $xudu[$bookid];
		}
		
		$this->assign('xudu_id', $xudu_id);
		$this->assign('page_list', $firstPage);
		$this->assign('bookid', $bookid);
		$this->assign('Detail', $detail);
		$this->display();
	}
	
	public function newpartlist(){
		$bookid = I('get.bookid');
		$detail = D('Book')->where('id='.$bookid)->find();
		//$contents = I('get.contents');

		//取出列表
		$map['bookid'] = $bookid;
		$contents = 1;
		if(!$contents){
			//$chapter_list = D('BookChapter')->where($map)->order('`index`, rank DESC')->field('title AS text, `index`, rank')->select();
			
			//取出前20章
			$firstPage = D('BookChapter')->where($map)->order('`index`, rank DESC')->field('title, `index`, rank')->limit(20)->select();
			
			
			//倒叙前20章
			$revertFirstPage = D('BookChapter')->where($map)->order('`index` DESC, rank DESC')->limit(20)->select();
			krsort($revertFirstPage);
	
			$this->assign('first_page_list', $firstPage);
			$this->assign('revert_first_page_list', $revertFirstPage);
		}else{
			//取出所有章节
			$page = I('get.p');
			$orderDirection = I('get.orderDirection') == 'desc' ? 'desc' : 'asc';
			
			$order = '`index` '.$orderDirection.', rank DESC';
			$pagesize = 20;
			
			$chapter_list = D('BookChapter')->where($map)->order($order)->page($page, $pagesize)->field('title, `index`, rank')->select();
			$count = D('BookChapter')->where($map)->count();
			
			$Page = new \Think\PageBook($count, $pagesize);// 实例化分页类 传入总记录数和每页显示的记录数
			$this->assign('orderDirection', $orderDirection);
			$this->assign('pages', $Page->show());
			$this->assign('page_list', $chapter_list);
		}
		$this->assign('Detail', $detail);
		$this->assign('bookid', $bookid);
		$this->display();
	}
	
	public function search(){
		$keyword = I('get.keywords');
		if(!$keyword){
			$this->error('请输入关键字');
		}
		$url = 'http://dushu.baidu.com/ajax/searchresult?word='.urlencode($keyword);
		$content = $this->_curl($url);
		//var_dump($content['list']);exit;
		/*
		if($content['list']){
			
		} */
		$this->assign('content', $content);
		$this->display();
	}
	
	public function addBook(){
		
		$gid = I('get.gid');
		//判断是否采集过, 没有的话, 保存文章信息
		$map_book['gid'] = $gid;
		$exist_book = D('Book')->where($map_book)->find();
		
		if(!$exist_book){
			$url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$gid;
			$content = $this->_curl($url);
			if(!$content || $content['status'] != 1)
				return false;
				
			$data_book['title'] = $content['data']['title'];
			$data_book['summary'] = $content['data']['summary'];
			$data_book['thumb'] = $content['data']['originalCoverImage'];
			$data_book['author'] = $content['data']['author'];
			$data_book['gid'] = $content['data']['gid'];
			$data_book['category'] = $content['data']['category'];
			$data_book['url'] = $content['data']['url'];
			$data_book['create_time'] = NOW_TIME;
		
			$bookid = D('Book')->add($data_book);
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
			
		}else{
			$bookid = $exist_book['id'];
		}
		redirect(U('info?bookid='.$bookid));
		
	}
	
	public function view(){
		
		$bookid = I('get.bookid');
		$index = I('get.index');

		//取出文章信息
		$detail = D('Book')->where('id='.$bookid)->find();
		if(!$index || !$detail)
			$this->error('查无此文章');
		
		//取出章节
		$map['bookid'] = $bookid;
		$map['index'] = $index;
		$detail_chapter = D('BookChapter')->where($map)->find();
		//判断是否已经采集
		if($detail_chapter['status'] == 0){
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
				
				//如果内容太少, 则不保存
				if(strlen($chapter['content']) > 1000)
					D('BookChapter')->where('id='.$detail_chapter['id'])->save($data);
			}
		}

		//取出下一章
		$map_next['bookid'] = $bookid;
		$map_next['index'] = array('gt', $index);
		$next_chapter = D('BookChapter')->where($map_next)->order('`index`')->field('`index`')->find();
			
		//取出上一章
		$map_pre['bookid'] = $bookid;
		$map_pre['index'] = array('lt', $index);
		$pre_chapter = D('BookChapter')->where($map_pre)->order('`index` DESC')->field('`index`')->find();

		//保存到续读
		$xudu = cookie('xudu');
		if(!$xudu[$bookid] || $xudu[$bookid] < $index){
			$xudu[$bookid] = $index;
		}

		//重新排序
		if(cookie('bookid') != $bookid){
			cookie('bookid', $bookid);
			$first_book[$bookid] = $xudu[$bookid];
			unset($xudu[$bookid]);
			$xudu = $first_book + $xudu;
		}
		cookie('xudu', $xudu, $this->cookie_time);
		
		$this->assign('Detail', $detail);
		$this->assign('detail_chapter', $detail_chapter);
		$this->assign('nextpage', $next_chapter['index']);
		$this->assign('prepage', $pre_chapter['index']);
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
	//加载下一章
	public function article_by_ajax(){
		if(IS_POST){

			$bookid = I('get.bookid');
			$index = I('post.index');
			//var_dump($bookid);exit;
			//取出文章信息
			$detail = D('Book')->where('id='.$bookid)->find();
			if(!$detail)
				$this->error('查无此文章');
			
			//取出章节
			$map['bookid'] = $bookid;
			$map['index'] = $index;
			$detail_chapter = D('BookChapter')->where($map)->find();
			if(!$detail_chapter){
				$this->ajaxReturn(array('codeNum' => 30));
			}
			//判断是否已经采集
			if($detail_chapter['status'] == 0){
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
					
					//如果内容太少, 则不保存
					if(strlen($chapter['content']) > 1000)
						D('BookChapter')->where('id='.$detail_chapter['id'])->save($data);
				}
			}
			//取出下一章
			$map_next['bookid'] = $bookid;
			$map_next['index'] = array('gt', $index);
			$next_chapter = D('BookChapter')->where($map_next)->order('`index`')->field('`index`')->find();
			
			//取出上一章
			$map_pre['bookid'] = $bookid;
			$map_pre['index'] = array('lt', $index);
			$pre_chapter = D('BookChapter')->where($map_pre)->order('`index` DESC')->field('`index`')->find();
			
			//保存到续读
			$xudu = cookie('xudu');
			if(!$xudu[$bookid] || $xudu[$bookid] < $index){
				$xudu[$bookid] = $index;
				cookie('xudu', $xudu, $this->cookie_time);
			}
			
			//取出列表
			$this->assign('detail_chapter', $detail_chapter);
			$this->assign('nextpage', $next_chapter['index']);
			$this->assign('prepage', $pre_chapter['index']);
			$this->assign('bookid', $bookid);
			$this->display();
			
		}
	}
	
	//删除某篇文章的cookie
	public function deleteCookie(){
		$bookid = I('get.bookid');
		$xudu = cookie('xudu');
		if($xudu[$bookid]){
			unset($xudu[$bookid]);
			//重新保存
			cookie('xudu', $xudu, $this->cookie_time);
			
		}
		redirect(U('index'));
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
	
	public function ajax_saveXudu(){
		if(IS_POST){
			$bookid = I('post.bookid');
			$index = I('post.index');
			
			//保存到续读
			$xudu = cookie('xudu');
			if(!$xudu[$bookid] || $xudu[$bookid] < $index){
				$xudu[$bookid] = $index;
				cookie('xudu', $xudu, $this->cookie_time);
			}
		}
	}
	
	//下载章节到缓存
	public function ajax_cacheChapter(){
		//echo 1;exit;
		$num = I('get.num') ? I('get.num') : 10;	//缓存章节数
		$bookid = I('get.bookid');
		$detail = D('Book')->where('id='.$bookid)->find();
		
		$index = I('get.index');
		if(!$index){
			//缓存续读章节后的若干章节
			$xudu = cookie('xudu');
			$index = $xudu[$bookid] ? $xudu[$bookid] : 1;
		}
		
		$map['bookid'] = $bookid;
		$map['index'] = array('egt', $index);
		$chapter_list = D('BookChapter')->where($map)->limit($num+1)->select();
		if($chapter_list){
			foreach ($chapter_list as $k => $detail_chapter){
				
				if($k == $num){
					break;
				}
				$nextPage = $chapter_list[$k+1]['index'];
				//拼凑要返回的内容
				$content = '';
				$key_name = $bookid.'_'.$detail_chapter['index'];
				//取出内容
				//判断是否已经采集
				if($detail_chapter['status'] == 0){
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
							
						//如果内容太少, 则不保存
						if(strlen($chapter['content']) > 1000)
							D('BookChapter')->where('id='.$detail_chapter['id'])->save($data);
					}
				}
				$content = '<h3>'.$detail_chapter['title'].'(缓存)</h3><div style="height:10px"></div>'.$detail_chapter['content'].'<div style="height:30px"></div><script>
$(function(){
        $("input[name=nextpage]").val("'.$chapter_list[$k+1]['index'].'");
    $("input[name=totalPage]").val("2703");
    $("input[name=articleId]").val("'.$bookid.'");
    $("ul li#liprev").html("<a href=\''.U('view?bookid='.$bookid.'&index='.$chapter_list[$k-1]['index']).'\'>上一章</a>");
            $("ul li#linext").html("<a href=\''.U('view?bookid='.$bookid.'&index='.$chapter_list[$k+1]['index']).'\'>下一章</a>");
     });</script>';
				$return_data[$key_name] = $content;
			}
		}

		//var_dump($return_data);
		//取出下一篇的index
		$return['data'] = $return_data;
		$return['num'] = (int)count($return_data);
		$return['nextPage'] = (int)$nextPage;
		$this->ajaxReturn($return);
	}
	
	public function user(){
		$userid = cookie('userid');
		
		if(!$userid || !session('userid') || $userid != session('userid')){
			$template = 'login';
		}else{
			$template = 'user';
		}
		
		$this->display($template);
	}
	
	//会员登录
	public function login(){
		
		$this->display();
	}
	
	public function _curl($url){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$txt = curl_exec($ch);
		if (curl_errno($ch)) {
			return false;
		}
		curl_close($ch);
		return json_decode($txt, true);
	}
}