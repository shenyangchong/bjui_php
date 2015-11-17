<?php 
/*
 * 文章模型
 */
namespace Admin\Model;
use Think\Model;
class ArticleModel extends Model {
	
	private $setting;
	private $attachment;
	public function __construct(){
		parent::__construct();
		$this->attachment = D('Attachment');
		$this->setting = array(
			'enablesaveimage' => 0,
			'enablesavebase64image' => 1,
		);
	}
	protected $_validate = array(
			array('title','require','标题不能为空！', 1), 
			array('content','require','内容不能为空！', 1), 
 			array('catid','require','栏目不能为空',1, '', 1), 
// 			array('value',array(1,2,3),'值的范围不正确！',2,'in'), // 当值不为空的时候判断是否在一个范围内
// 			array('repassword','password','确认密码不正确',0,'confirm'), // 验证确认密码是否和密码一致
// 			array('password','checkPwd','密码格式不正确',0,'function'), // 自定义函数验证密码格式 
	);
	/**
	 * 添加内容
	 *
	 * @param $datas
	 * @param $isimport 是否为外部接口导入
	 */
	public function add_content($data){
		//是否下载内容中的图片
		if($this->setting['enablesaveimage']){
			$data['content'] = $this->attachment->download('content', $data['content']);
		}
		//如果有缩略图（base64）则保存图片，并转换成本地路径。
		/* if($data['thumb']){
			$data['content'] = $this->attachment->downloadbase64image('content', $data['thumb']);
		} */
		
		//是否有创建时间
		/*if($data['inputtime'] && !is_numeric($data['inputtime'])) {
			$data['inputtime'] = strtotime($data['inputtime']);
		} elseif(!$data['inputtime']) {
			$data['inputtime'] = time();
		} else {
			$data['inputtime'] = $data['inputtime'];
		}*/
		
		if($data['updatetime'] && !is_numeric($data['updatetime'])) {
			$data['updatetime'] = strtotime($data['updatetime']);
		} elseif(!$data['updatetime']) {
			$data['updatetime'] = time();
		} else {
			$data['updatetime'] = $data['updatetime'];
		}
		
		//自动提取摘要
		if(isset($_POST['add_introduce']) && $data['description'] == '' && isset($data['content'])) {
			$content = stripslashes(html_entity_decode($data['content'], ENT_QUOTES));
			$introcude_length = intval($_POST['introcude_length']);
			$data['description'] = str_cut(str_replace(array("'","\r\n","\t",'[page]','[/page]','&ldquo;','&rdquo;','&nbsp;'), '', strip_tags($content)),$introcude_length);
			$data['description'] = addslashes($data['description']);
		}
		//自动提取缩略图
		if(isset($_POST['auto_thumb']) && $data['thumb'] == '' && isset($data['content'])) {
			$content = $content ? $content : stripslashes(html_entity_decode($data['content'], ENT_QUOTES));
			$auto_thumb_no = intval($_POST['auto_thumb_no'])-1;
			if(preg_match_all("/(src)=([\"|']?)([^ \"'>]+\.(gif|jpg|jpeg|bmp|png))\\2/i", $content, $matches)) {
				$data['thumb'] = $matches[3][$auto_thumb_no];
			}
		}
		$data['description'] = str_replace(array('/','\\','#','.',"'"),' ',$data['description']);
		//$systeminfo['keywords'] = str_replace(array('/','\\','#','.',"'"),' ',$systeminfo['keywords']);
		//主表
		$id = $this->add($data);
		//$this->update($systeminfo,array('id'=>$id));
		//更新URL地址
		/* if($data['islink']==1) {
			$urls[0] = trim_script($_POST['linkurl']);
			$urls[0] = remove_xss($urls[0]);
				
			$urls[0] = str_replace(array('select ',')','\\','#',"'"),' ',$urls[0]);
		} else {
			$urls = $this->url->show($id, 0, $systeminfo['catid'], $systeminfo['inputtime'], $data['prefix'],$inputinfo,'add');
		}
		 */

		//更新栏目统计数据
		$this->update_category_items($data['catid'],'add',1);

		return $id;
	}
	
	/**
	 * 修改内容
	 *
	 * @param $datas
	 */
	public function edit_content($data,$id) {
		//是否下载内容中的图片
		if($this->setting['enablesaveimage']){
			$data['content'] = $this->attachment->download('content', $data['content']);
		}
		//echo ($data['content']);exit;
		//是否有创建时间
		if($data['updatetime'] && !is_numeric($data['updatetime'])) {
			$data['updatetime'] = strtotime($data['updatetime']);
		} elseif(!$data['updatetime']) {
			$data['updatetime'] = time();
		} else {
			$data['updatetime'] = $data['updatetime'];
		}
		//自动提取摘要
		if(isset($_POST['add_introduce']) && $data['description'] == '' && isset($data['content'])) {
			//$data是通过I方法传入的,　所以需要html_entity_decode反转义html标签
			$content = stripslashes(html_entity_decode($data['content'], ENT_QUOTES));
			$introcude_length = intval($_POST['introcude_length']);
			$data['description'] = str_cut(str_replace(array("'","\r\n","\t",'[page]','[/page]','&ldquo;','&rdquo;','&nbsp;', ' '), '', strip_tags($content)),$introcude_length);
			$data['description'] = addslashes($data['description']);
		}
		//自动提取缩略图
		if(isset($_POST['auto_thumb']) && $data['thumb'] == '' && isset($data['content'])) {
			//$data是通过I方法传入的,　所以需要html_entity_decode反转义html标签
			$content = $content ? $content : stripslashes(html_entity_decode($data['content'], ENT_QUOTES));
			$auto_thumb_no = intval($_POST['auto_thumb_no'])-1;
			if(preg_match_all("/(src)=([\"|']?)([^ \"'>]+\.(gif|jpg|jpeg|bmp|png))\\2/i", $content, $matches)) {
				$data['thumb'] = $matches[3][$auto_thumb_no];
			}
		}
		$data['description'] = str_replace(array('/','\\','#','.',"'"),' ',$data['description']);
		//保存信息
		$this->where('id='.$id)->save($data);
		
		return true;
		
	}
	/**
	 * 删除内容
	 * @param $id 内容id
	 * @param $file 文件路径
	 * @param $catid 栏目id
	 */
	public function delete_content($id, $catid = null) {
		//删除主表数据
		//$this->delete(array('id'=>$id));
		$this->where('id='.$id)->delete();
		//删除从表数据
		//$this->table_name = $this->table_name.'_data';
		//$this->delete(array('id'=>$id));
		//重置默认表
		//$this->table_name = $this->db_tablepre.$this->model_tablename;
		//更新栏目统计
		//$this->update_category_items($catid,'delete');
	}
	
	//栏目统计
	private function update_category_items($catid,$action = 'add',$cache = 0) {
		/* $this->category_db = pc_base::load_model('category_model');
		if($action=='add') {
			$this->category_db->update(array('items'=>'+=1'),array('catid'=>$catid));
		}  else {
			$this->category_db->update(array('items'=>'-=1'),array('catid'=>$catid));
		}
		if($cache) $this->cache_items(); */
	}
}
