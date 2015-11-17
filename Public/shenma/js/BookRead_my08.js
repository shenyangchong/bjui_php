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
				//��ȡ�ı����ݵ��� �и�
				var lineHeight =  $("div#readercontainer").css("line-height");
				var lineHeightNum = parseInt(lineHeight);
				if(endY>=0&&endY<intHeight){
					    $(window).scrollTop( nowTop - (height-lineHeightNum));
					    //�ر� �˵�
					    //CloseTools();
					}else if(endY>=0&&endY>(intHeight*(rate-1))){
						//�ر� �˵�
						//CloseTools();
						$(window).scrollTop( nowTop + (height-lineHeightNum));
						}else{
					//�������л�����
					if($("div.book_title").css("display")=="none"){ OpenTools();}else{CloseTools();}
				}
				//CloseTools();
		}
	});
});

	//�Ķ�ҳ���·�ҳ��������
	function InitHelpBox(){
		var show=true;
	    if(show){
	    	var SupportsTouches=typeof(window.ontouchstart)!='undefined';
	    	var StartEvent=SupportsTouches?"touchstart":"click";
	    	$(".helpbox").show();
	    	$(".helpbox").bind(StartEvent,function(){$(".helpbox").hide();});
		}
	}
	//��ȡ��ǰ�߶�
	function FixEndY(endY){
		var tmp=endY;
		if($(document.body).scrollTop()==0){
			endY=endY-GetScrollTop();
		}
		if(endY<0){endY=tmp;}
		return endY;
	}

	//�رչ��ܲ˵���ʾ��
	function CloseTools(){
		$("div.book_title,#tool_btm,#marqueeid,div.pop-upblue,span.spantools,div#topNavBox,div#topNavBoxTwo").hide();
		//�ر����ۡ�����֮���޸Ĵ�����ť��class
		$("span#firstspan").attr("class","a1star");
	}
	//�򿪹��ܲ˵���ʾ��
	function OpenTools(){
		$("div.book_title,#tool_btm,#marqueeid,div.pop-upblue").show();
	}

	//��ȡ�������߶�
	function GetScrollTop(){
		return $(document.body).scrollTop()||$(document.documentElement).scrollTop()||0;
	}

	//��ȡ���λ��
	function getPosition(e){
	var point=SupportsTouches?(e.touches?e.touches[0]:(e.originalEvent?e.originalEvent.touches[0]:e)):e;
	var deltaX=point.clientX<0?(point.pageX-($(document.body).scrollLeft()||$(document.documentElement).scrollLeft()||0)):point.clientX;
	var deltaY=point.clientY<0?(point.pageY-BookReader.Other.GetScrollTop()):point.clientY;
	return{'x':deltaX,'y':deltaY};
	}

