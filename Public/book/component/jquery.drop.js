;(function(){
    drop.list = [];
    function drop(options){
        var self = this;
        var entertimer = null;
        var leavetimer = null;
        this.options = $.extend({}, drop.options, options);
        this.element = this.options.element;
        this.handler = this.element.find('.drop-show');
        this.content = this.element.find('.drop-hide');
        if(this.options.eventType == 'toggle'){
            this.handler.click(function(){
                self._isOpen ? self.close() : self.open();
            });
            this.element.click(function(event){
                event.stopPropagation();
            });
            $('body').bind('click',function(){
                self.close();
            }).delegate(':text,textarea','focus',function(){
                self.close();
            });
        }else{
            this.handler.add(this.content).mouseenter(function(){
                clearTimeout(leavetimer);
                entertimer = setTimeout(function(){
                    self.open();
                },300);
            });
            this.handler.add(this.content).mouseleave(function(){
                clearTimeout(entertimer);
                leavetimer = setTimeout(function(){
                    self.close();
                },300);
            });
        }
        drop.list.push(this);
    }
    drop.prototype.open = function(){
        if(!this._isOpen){
            this.element.addClass('drop-active');
            this._isOpen = true;
            for(var i = 0; i < drop.list.length; i++){
                drop.list[i] !== this && drop.list[i].close();
            }
            $.isFunction(this.options.onOpen) && this.options.onOpen.call(this);
        }
    }
    drop.prototype.close = function(){
        if(this._isOpen){
            this.element.removeClass('drop-active');
            this._isOpen = false;
            $.isFunction(this.options.onClose) && this.options.onClose.call(this);
        }
    }
    drop.prototype.setConfig = function(options){
        $.extend(this.options, options);
        return this;
    }
    drop.options = {
        element: null,
        eventType: 'toggle',
        onOpen : null,
        onClose: null
    }
    $.fn.drop = function(options){
        return this.each(function(){
            var _drop = $(this).data('THINKDROP');
            if(!_drop){
                $(this).data('THINKDROP', new drop({
                    element: $(this),
                    eventType: $(this).hasClass('drop-hover') ? 'hover' : 'toggle'
                }));
            }else{
                _drop.setConfig(options);
            }
        });
    }
    $(function(){
        $('.w-drop').drop();
    });
})();