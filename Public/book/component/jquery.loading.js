;(function(){
    var config = {
        cls: null,
        text: '数据加载中...'
    };
    $.fn.loading = function(text, cls, hide){
        var _loading = $(this).data('jquery-loading');
        if(!_loading){
            _loading = $('<div class="think-loading"><span class="loading-inner"><i class="loading-image"></i><b class="loading-text"></b></span></div>');
            $(this).data('jquery-loading', _loading);
        }
        if(text == 'hide'){
            _loading.removeClass('loading-active');
        }else{
            text = typeof text == 'undefined' ? config.text : text;
            cls = cls || config.cls;
            _loading.find('.loading-text').html(text);
            _loading.addClass(cls);
            _loading.addClass('loading-active');
        }
        if(!$(this).find('.'+cls).length){
            $(this).append(_loading);
        }
        return $(this);
    }
    $.loading = function(text,cls){

    }
    $.loading.setConfig = function(){
        return config[name] = data;
    }
})();