var SupportsTouches=typeof(window.ontouchstart)!='undefined';
var StartEvent="touchstart";
var MoveEvent="touchmove";
//var EndEvent=SupportsTouches?"touchend":"click";
var EndEvent="click";
var isMove=false;
var endY=-1;
$(function(){
	$("#article").bind(StartEvent,function(se){
		isMove=false;
		endY=getPosition(se).y;
		});
	$("#article").bind(MoveEvent,function(me){
		if(SupportsTouches){
		isMove=true;
		if($("#book_title_shang").css("display")!="none"){CloseTools();}
		endY=getPosition(me).y;
		}
	});
	
	$("#article").bind(EndEvent,function(e){
		if(!SupportsTouches){endY=getPosition(e).y;}
		endY=FixEndY(endY);
		if(!isMove){
			    var rate=3;
				var intHeight=parseInt($(window).height()/rate);
				var nowTop = $(window).scrollTop();
				var height = $(window).height();
				var scrohi = document.body.scrollHeight;
				//获取文本内容单行 行高
				var lineHeight =  $("div#readercontainer").css("line-height");
				var lineHeightNum = parseInt(lineHeight);
				if(endY>=0&&endY<intHeight){
					    $(window).scrollTop( nowTop - (height-lineHeightNum));
					    //关闭 菜单
					    //CloseTools();
					}else if(endY>=0&&endY>(intHeight*(rate-1))){
						//关闭 菜单
						//CloseTools();
						$(window).scrollTop( nowTop + (height-lineHeightNum));
						}else{
					//功能区切换功能
					if($("div.book_title").css("display")=="none"){ OpenTools();}else{CloseTools();}
				}
				//CloseTools();
		}
	});
});

	//阅读页上下翻页及功能区
	function InitHelpBox(){
		var show=true;
	    if(show){
	    	var SupportsTouches=typeof(window.ontouchstart)!='undefined';
	    	var StartEvent=SupportsTouches?"touchstart":"click";
	    	$(".helpbox").show();
	    	$(".helpbox").bind(StartEvent,function(){$(".helpbox").hide();});
		}
	}
	//获取当前高度
	function FixEndY(endY){
		var tmp=endY;
		if($(document.body).scrollTop()==0){
			endY=endY-GetScrollTop();
		}
		if(endY<0){endY=tmp;}
		return endY;
	}

	//关闭功能菜单显示层
	function CloseTools(){
		$("div.book_title,#tool_btm,#marqueeid,div.pop-upblue,span.spantools,div#topNavBox,div#topNavBoxTwo").hide();
		//关闭评论、打赏之后修改触发按钮的class
		$("span#firstspan").attr("class","a1star");
	}
	//打开功能菜单显示层
	function OpenTools(){
		$("div.book_title,#tool_btm,#marqueeid,div.pop-upblue").show();
	}

	//获取滚动条高度
	function GetScrollTop(){
		return $(document.body).scrollTop()||$(document.documentElement).scrollTop()||0;
	}

	//获取点击位置
	function getPosition(e){
	var point=SupportsTouches?(e.touches?e.touches[0]:(e.originalEvent?e.originalEvent.touches[0]:e)):e;
	var deltaX=point.clientX<0?(point.pageX-($(document.body).scrollLeft()||$(document.documentElement).scrollLeft()||0)):point.clientX;
	var deltaY=point.clientY<0?(point.pageY-BookReader.Other.GetScrollTop()):point.clientY;
	return{'x':deltaX,'y':deltaY};
	}

