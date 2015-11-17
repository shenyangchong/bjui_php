<?php
namespace Admin\Controller;
use Admin\Controller\AdminController;

/**
 * 计划任务部分
 * @author Lain
 *
 */
class CronController extends AdminController {
	
	public function test(){
		$data['create_time'] = NOW_TIME;
		$result = M('post_log')->add($data);
	}
	
	//每分钟跑一次
	public function gather(){
		//保存请求时间
		//$data['create_time'] = NOW_TIME;
		//$result = M('post_log')->add($data);
		//取出需要更新文章
		
		$map_cron['next_cron_time'] = array('lt', NOW_TIME);
		//$map_cron['status']		//是否在连载
		$detail = D('Book')->where($map_cron)->order('next_cron_time')->find();

		$gid = $detail['gid'];
		$bookid = $detail['id'];
		
		//如果没有计划, 返回真
		if(!$detail)
			exit('over');
		
		//更新此次更新时间
		$data_cron['last_cron_time'] = NOW_TIME;
		$data_cron['next_cron_time'] = NOW_TIME + 3600;		//下次时间 1小时
		
		$result = D('Book')->where('id='.$bookid)->save($data_cron);
		
		if(!$gid)
			exit('error');
		
		$url = $this->getBookJs($gid);
		
		$content = json_decode(\Org\Net\Http::fsockopenDownload($url), true);
		
		if(!$content || $content['status'] != 1){
			exit('error');
		}
		//判断是否采集过, 没有的话, 保存文章信息
		//判断最新章节
		//取出所有章节
		$group = $content['data']['group'];
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
			exit('success');
		}else{
			//更新下一个任务
			$this->gather();
		}
		
		//更新, 记录信息
	}
	
	//返回形如 http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid=3961103225
	public function getBookJs($gid){
		//没有gid字段, 返回错误
		if(!$gid)
			return false;
		 
		$new_url = 'http://m.baidu.com/tc?srd=1&appui=alaxs&ajax=1&gid='.$gid;
		return $new_url;
	}
}