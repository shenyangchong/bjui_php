;
(function($) {
    var Event = {
        /**
         * 添加事件
         * @param name {String} 事件名称
         * @param data {Object} 事件数据
         * @param fun {Function} 回调函数
         * @return void
         */
        on : function(name,data,fun) {
            $(this).on(Event._getName(name),data||{},fun);
            return this;
        },

        /**
         * 移除事件
         * @param name {String} 事件名称
         * @return void
         */
        off : function(name) {
            $(this).off(Event._getName(name));
            return this;
        },

        /**
         * 触发事件
         * @param name {String} 事件名称
         * @param data {Object} 事件数据
         * @return void
         */
        trigger : function(name,data) {
            var _n1 = Event._getName(name);
            var _n2 = Event._getName(name, true);
            $(this).trigger(_n2, data);
            $(this).trigger(_n1, data);
            return this;
        },

        /**
         * 事件名称
         * @param name {String} 事件名称
         * @param pr {String} 时间类型，私有或公有
         * @return void
         */
        _getName : function(name,pr) {
            return pr ? '__on'+name+'__' : 'on'+name;
        }
    }
    var Extend = function(o1,o2){
        for(var i in o2){
            if(i in o1){
                o1['__'+i] = o1[i];
            }
            o1[i] = o2[i];
        }
        o1.callParent = function(name,param){
            name = '__'+name;
            if((name in o1) && $.isFunction(o1[name])){
                o1[name].apply(o1, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
    function node(options){
        this._options = $.extend({
            id: null,
            pid: null,
            data: null
        },options);
        this.id = this._options.id;
        this.pid = this._options.pid;
        //支持事件
        Extend(this, Event);
    }

    /**
     * 销毁节点
     * @param id {Number} 节点ID
     * @return void
     */
    node.prototype.destroy = function() {
        for(var i in this){
            if(this[i] instanceof jQuery){
                this[i].remove();
            }
            delete this[i];
        }
    }

    /**
     * 设置值
     * @param id {Number} 节点ID
     * @param data {Object} 节点数据信息
     * @return void
     */
    node.prototype.set = function(name, data) {
        if(typeof name == 'string'){
            return this._options.data[name] = data;
        }
    }

    /**
     * 获取值
     * @param id {Number} 节点ID
     * @param data {Object} 节点数据信息
     * @return void
     */
    node.prototype.get = function(name) {
        if(typeof name == 'string' && (name in this._options.data)){
            return this._options.data[name];
        }
    }

    /**
     * 设置等级
     * @return void
     */
    node.prototype.setLevel = function(level) {
        if($.isNumeric(level)){
            this._level = level;
        }
    }

    /**
     * 获取等级
     * @return void
     */
    node.prototype.getLevel = function() {
        return this._level || 0;
    }

    /**
     * 是否含有子节点
     * @return void
     */
    node.prototype.hasChildren = function() {
        return this._children ? true: false;
    }

    /**
     * 获取子节点
     * @return void
     */
    node.prototype.getChildren = function() {
        return this._children || [];
    }

    /**
     * 节点管理构造类
     * @param data 待序列化成树形格式的数据
     * @param parentId 父级节点标识
     * @param childId 子级节点标识
     * @return Object
     */
    function nodeManage(data, options){
        //合并配置项
        this._options = $.extend({},{
            parentField : 'pid',
            childField : 'id',
            onCreateItem: null
        },options);
        //记录节点是否更新过
        this._nodeUpdateStatus = true;
        //设置父节点字段标识
        this.setParentField(this._options.parentField);
        //设置子节点字段标识
        this.setChildField(this._options.childField);
        //序列化节点数据
        this._nodeData = nodeManage.serialize.call(this, data, this._parentField, this._childField,function(main,proxy){
            this._proxyData = proxy;
        });
        //获取平行节点数据
        this._faceData = this.childrens();
    }
    /**
     * 获取节点总数
     * @return number
     */
    nodeManage.prototype.getTotal = function(){
        return this._faceData.length || 0;
    }

    /**
     * 获取节点位置
     * @return number
     */
    nodeManage.prototype.getIndex = function(node){
        var _id = node.id;
        for(var i = 0; i < this._faceData.length; i++){
            if(this._faceData[i].id == _id){
                return i;
            }
        }
        return -1;
    }

    /**
     * 序列化节点数据
     * @return object
     */
    nodeManage.prototype.serializeNodeData = function(data){
        var _nodes = nodeManage.serialize.call(this, data, this._parentField, this._childField, $.noop, this._proxyData, this._nodeData);
        this._nodeUpdateStatus = true;
        this._faceData = this.childrens();
        return _nodes;
    }

    /**
     * 更新节点数据
     * @return object
     */
    nodeManage.prototype.updateNodeData = function(data){

    }

    /**
     * 获取节点数据
     * @return object
     */
    nodeManage.prototype.getData = function(data){
        return this._nodeData || [];
    }

    /**
     * 导出节点数据
     * @return object
     */
    nodeManage.prototype.exportData = function(){
        var data = [], i = 0, l = this._faceData.length;
        for(; i < l; i++){
            data.push(this._faceData[i]._options.data);
        }
        return data;
    }

    /**
     * 设置父节点字段标识
     * @return void
     */
    nodeManage.prototype.setParentField = function(field){
        this._parentField = field || 'pid';
        return this;
    }

    /**
     * 设置子节点字段标识
     * @return void
     */
    nodeManage.prototype.setChildField = function(field){
        this._childField = field || 'id';
        return this;
    }

    /**
     * 获取节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.find = function(id) {
        var _length = this._faceData.length, _i = 0;
        for(; _i < _length; _i++){
            if(this._faceData[_i].id == id){
                return this._faceData[_i];
            }
        }
    }

    /**
     * 获取所有后代节点
     * @param id {Number} 父节点ID
     * @return node
     */
    nodeManage.prototype.childrens = function(node) {
        var _childrens = [],
            _self = this;
        if(nodeManage.isNode(node)){
            recursion(node);
        }else{
            if(this._nodeUpdateStatus){
                var _childs = this.children();
                for(var i = 0; i < _childs.length; i++){
                    _childrens.push(_childs[i]);
                    recursion(_childs[i]);
                }
                this._nodeUpdateStatus = false;
            }else{
                _childrens = this._faceData;
            }
        }
        function recursion(node){
            var _children = _self.children(node),
                _length = _children.length;
            for(var i = 0; i < _length; i++){
                _childrens.push(_children[i]);
                arguments.callee(_children[i]);
            }
        }
        return _childrens;
    }

    /**
     * 获取子节点
     * @param id {Number} 父节点ID
     * @return node
     */
    nodeManage.prototype.children = function(node) {
        var _children = [], _proxy = {};
        if(nodeManage.isNode(node)){
            _proxy = node._children || [];
        }else{
            _proxy = this._nodeData;
        }
        for(var i in _proxy){
            _children.push(_proxy[i]);
        }
        return _children;
    }

    /**
     * 获取父节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.parent = function(node) {
        var _parent;
        if(nodeManage.isNode(node)){
            var _pid = node.pid;
            for(var i in this._faceData){
                if(this._faceData[i].id == _pid){
                    _parent = this._faceData[i];
                    break;
                }
            }
        }
        return _parent;
    }

    /**
     * 获取所有祖先节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.parents = function(node) {
        var _parents = [];
        if(nodeManage.isNode(node)){
            var _nodes = this._faceData;
            (function(_node, _nodes){
                for(var i in _nodes){
                    if(_node.pid && _node.pid == _nodes[i].id){
                        _parents.push(_nodes[i]);
                        arguments.callee(_nodes[i], _nodes);
                        return;
                    }
                }
            })(node, _nodes);
        }
        return _parents;
    }

    /**
     * 获取所有同辈节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.siblings = function(node, nodes) {
        var _siblings = [];
        if(nodeManage.isNode(node)){
            var _parent = this.parent(node);
            if(_parent){
                var _children = this.children(_parent);
                for(var i in _children){
                    if(_children[i] !== node){
                        _siblings.push(_children[i]);
                    }
                }
            }
        }
        return _siblings;
    }

    /**
     * 获取紧邻的后面同辈节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.next = function(node, nodes) {
        var _next;
        if(nodeManage.isNode(node)){
            var _parent = this.parent(node),
                _chldrens = nodes || this.children(_parent),
                _status = false;
            for(var i in _chldrens){
                if(_status){
                    _next = _chldrens[i];
                    break;
                }
                if(_chldrens[i] === node){
                    _status = true;
                }
            }
        }
        return _next;
    }

    /**
     * 获取所有的后面同辈节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.nextAll = function(id) {

    }

    /**
     * 获取紧邻的前面同辈节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.prev = function(node, nodes) {
        var _prev, _node;
        if(nodeManage.isNode(node)){
            var _parent = this.parent(node),
                _chldrens = nodes || this.children(_parent);
            for(var i in _chldrens){
                if(_chldrens[i] === node){
                    _prev = _node;
                    break;
                }
                _node = _chldrens[i];
            }
        }
        return _prev;
    }

    /**
     * 获取首个节点
     * @return node
     */
    nodeManage.prototype.first = function(node) {
        if(typeof node  == 'undefined'){
            return this._faceData[0];
        }else{
            if(nodeManage.isNode(node)){
                return this.children(node)[0];
            }
        }
    }

    /**
     * 获取最后节点
     * @return node
     */
    nodeManage.prototype.last = function(node) {
        if(typeof node  == 'undefined'){
            return this._faceData[this._faceData.length - 1];
        }else{
            if(nodeManage.isNode(node)){
                var _children = this.children(node);
                return _children[_children.length - 1];
            }
        }
    }

    /**
     * 获取所有的前面同辈节点
     * @param id {Number} 节点ID
     * @return node
     */
    nodeManage.prototype.prevAll = function(id) {

    }

    nodeManage.prototype.remove = function(node){
        var _parent = this.parent(node);
        var _removes = this.childrens(node),
            _length = 0;
        _removes.push(node);
        _length = _removes.length;
        if(_parent){
            var _children = _parent['_children'];
            for(var m in _children){
                if(_children[m] === node){
                    delete _children[m];
                }
            }
        }else{
            for(var i in this._nodeData){
                if(this._nodeData[i] === node){
                    delete this._nodeData[i];
                }
            }
        }
        if(_length){
            node['_children'] = [];
            for(var i = 0; i < _length; i++){
                for(var j = 0; j < this._faceData.length; j++){
                    if(this._faceData[j] === node){
                        this._faceData.slice(j,1);
                        break;
                    }
                }
                _removes[i].destroy();
            }
        }
        this._nodeUpdateStatus = true;
        this._faceData = this.childrens();
        return;
    }

    /**
     * 检测是否为合法节点
     * @param id {Object} 待检测的节点
     * @return boolean
     */
    nodeManage.isNode = function(id) {
        return id instanceof node;
    }

    //标识前缀
    nodeManage.prefix = 'tree-';
    /**
     * 序列化树形数据
     * @param data {Array|Object} 数据集
     * @param parentField {String} 父级字段标识
     * @param childField {String} 子级字段标识
     * @return data {1:{id:1,pid:0,text:'',children:{1:{id:2,pid:1,text:''},2:{..},3:{..}}}}
     */
    nodeManage.serialize = function(data, parentField, childField, callback, proxyData, rootData) {
        var _self = this,
        _data = $.isFunction(data) ? data() : data,
        _main = {},
        _proxy = proxyData || {},
        _proxyResult = {},
        _parentField = $.type(parentField) == 'string' ? parentField : 'pid',
        _childField = $.type(childField) == 'string' ? childField : 'id',
        _length = 0;
        _data = $.isArray(_data) ? _data : [_data];
        _length = _data.length;
        for (var i = 0; i < _length; i++) {
            var _mask = nodeManage.prefix+_data[i][_childField].toString();
            _proxy[_mask] = new node({
                data: _data[i],
                id: _data[i][_childField],
                pid: _data[i][_parentField]
            });
            if(proxyData){
                _proxyResult[_mask] = _proxy[_mask];
            }
        }
        for (var i = 0; i < _length; i++) {
            if (_proxy[nodeManage.prefix+_data[i][_parentField].toString()]) {
                if (!_proxy[nodeManage.prefix+_data[i][_parentField].toString()]['_children']) {
                    _proxy[nodeManage.prefix+_data[i][_parentField].toString()]['_children'] = {};
                }
                _proxy[nodeManage.prefix+_data[i].pid.toString()]['_children'][nodeManage.prefix+_data[i].id.toString()] = _proxy[nodeManage.prefix+_data[i].id.toString()];
            } else {
                _main[nodeManage.prefix+_data[i][_childField].toString()] = _proxy[nodeManage.prefix+_data[i][_childField].toString()]
            }
        }
        if(proxyData){
            for(var i in _proxyResult){
                var _parent = this.parent(_proxyResult[i]);
                if(_parent){
                    _proxyResult[i]['_level'] = _parent.getLevel()+1;
                }else{
                    _proxyResult[i]['_level'] = 1;
                    rootData[i] = _proxyResult[i];
                }
                $.isFunction(_self._options.onCreateItem) && _self._options.onCreateItem.call(this, _proxyResult[i]);
            }
        }else{
            ;(function(data, level) {
                var _data = data,
                    _level = level + 1;
                for (var i in _data) {
                    _data[i]['_level'] = _level;
                    if (_data[i]['_children']) {
                        arguments.callee(_data[i]['_children'], _level);
                    }
                    $.isFunction(_self._options.onCreateItem) && _self._options.onCreateItem.call(this, _data[i]);
                }
            })(_main, 0);
        }
        $.isFunction(callback) && callback.call(this, _main, _proxy);
        if(proxyData){
            return _proxyResult;
        }
        return _main;
    }

    function combobox(options){
        var self = this;
        //合并配置参数
        this.options = $.extend({}, combobox.options, options);
        //记录打开状态
        this._isOpen = false;
        //重新包裸内容元素
        this.content = $('<div class="think-combobox"></div>');
        //重新包裸控制元素
        this.handler = $('<span class="think-handler"></span>');
        if(this.options.content instanceof jQuery){
            this.options.content.after(this.content);
            this.content.append(this.options.content);
        }
        if(this.options.handler instanceof jQuery){
            this.options.handler.after(this.handler);
            this.handler.append(this.options.handler);
        }
        this.handler.click(function(){
            self.open(!self._isOpen);
        });
        $.isFunction(this.options.onCreate) && this.options.onCreate.call(this);
    }

    combobox.prototype.open = function(){
        this._isOpen = true;
        this.content.addClass('combobox-open');
        this.handler.addClass('combobox-open');
    }

    combobox.prototype.close = function(){
        this._isOpen = false;
        this.content.removeClass('combobox-open');
        this.handler.removeClass('combobox-open');
    }

    combobox.prototype.setValue = function(){

    }

    combobox.prototype.getValue = function(){

    }

    combobox.prototype.disabled = function(){

    }

    combobox.prototype.focus = function(){

    }

    combobox.prototype.blur = function(){

    }

    combobox.createHtml = function(){

    }

    combobox.options = {
        handler : null,
        content: null,
        onOpen: null,
        onClose: null
    }

    /**
     * 树构造类
     * @param data 数据源
     * @param options 配置项
     * @return Object
     */
    function tree(data, options) {
        var self = this;
        //合并配置项
        this.options = $.extend({}, tree.options, options);
        //支持事件
        Extend(this, Event);
        //记录当前选中的节点列表
        this._selectedList = {};
        //设置选择模式
        this.setSelectMode(this.options.selectMode);
        //设置是否必须选中
        this.setSelectMust(this.options.selectMust);
        //创建节点对象
        this.nodes = new nodeManage(data, {
            parentField : this.options.parentField,
            childField : this.options.childField,
            onCreateItem: function(node){
                node.tree = self;
            }
        });
        //扩展节点对象
        Extend(node.prototype, tree.node);
        //记录根节点
        this.root = new node();
        this.root['element'] = $('<ul></ul>');
        this.root['tree'] = this;
        this.root['isRoot'] = true;
        //设置解析节点模版函数
        this.setParseTemp(this.options.parseTemp);
        //生成树结构
        this.tree = tree.createHtml.call(this, this.nodes.getData(), this.root['element']);
        //绑定选择节点事件
        this.on('onSelect', this.options.onSelect);
        //绑定展开关闭节点事件
        this.on('onSwitch', function(event,node){
            node.isOpen() ? node.close() : node.open();
        });
        //添加样式名称
        this.tree.addClass(this.options.cls);
        this.options.combobox && this.tree.addClass('combobox-content');
        this.options.appendTo && this.options.appendTo.append(this.tree);
        //绑定组合选择
        this.options.combobox && (this.combobox = new combobox({
            handler : this.options.combobox,
            content : this.tree,
            onCreate: function(){

            }
        }));
        $.isFunction(this.options.onCreate) && this.options.onCreate.call(this);
    }
    //数据缓存标识
    tree.cacheMask = 'THINKTREE';
    //包装node对象
    tree.node = {
        _isSelected: false,
        _isOpen : false,
        release: function(status, lockEvent, isOpen){
            var tree = this.tree;
            var status = typeof status == 'undefined' ? true : status ? true : false,
                name = this.id.toString(),
                isSelected = this._isSelected;
            if(tree._selectMode == 'single'){
                for(var i in tree._selectedList){
                    cancel(tree._selectedList[i], i);
                }
                status = tree._selectMust ? true : status;
                if(status){
                    if(!this._isSelected && !(name in tree._selectedList)){
                        define(this, name);
                    }
                }
            }else{
                if(status){
                    if(!this._isSelected && !(name in tree._selectedList)){
                        define(this, name);
                    }
                }else{
                    if(!this._isSelected && !(name in tree._selectedList)){
                        cancel(this, name);
                    }
                }
            }
            if(isOpen !== false){
                ;(this._isOpen && isSelected) ? this.close() : this.open();
            }
            if(!lockEvent){
                this.trigger('onSelect', this);
                this.tree.trigger('onSelect', this);
            }
            function define(node, name){
                node.element.addClass('tree-selected');
                node._isSelected = true;
                tree._selectedList[name] = node;
            }
            function cancel(node, name){
                node.element.removeClass('tree-selected');
                node._isSelected = false;
                delete tree._selectedList[name];
            }
        },
        selected: function(status, lockEvent, isOpen){
            var tree = this.tree;
            if(lockEvent !== true && $.isFunction(tree.options.onBeforeSelect) && tree.options.onBeforeSelect.call(this) === false){
                return false;
            }
            this.release.apply(this,arguments);
        },
        isSelected: function(){
            return this._isSelected;
        },
        open: function(){
            var _parents = this.tree.nodes.parents(this);
            _parents.push(this);
            $.each(_parents, function(i,v){
                if(!v._isOpen){
                    v.element.parent().addClass('tree-open');
                    v._isOpen = true;
                    v.trigger('onOpen', node);
                }
            });
            return this;
        },
        close: function(){
            if(this._isOpen){
                this.element.parent().removeClass('tree-open');
                this._isOpen = false;
                this.trigger('onClose', node);
            }
            return this;
        },
        isOpen : function(){
            return this._isOpen;
        },
        updateSwitch: function(){
            var _children = this.tree.nodes.children(this);
            if(_children.length){
                this['element'].children('.tree-switch').addClass('tree-switch-active');
            }else{
                this['element'].children('.tree-switch').removeClass('tree-switch-active');
            }
            return this;
        },
        disabled: function(){

        },
        setText: function(text){
            this.set('text', text);
            this['element'].children('.tree-text').html(text);
        },
        //移除节点
        remove: function(){
            var _parent = this.tree.nodes.parent(this);
            var _removes = this.tree.nodes.childrens(this);
                _removes.push(this);
            var _length = _removes.length;
            for(var i = 0; i < _length; i++){
                var _id = _removes[i].id.toString();
                if(_id in this.tree._selectedList){
                    delete this.tree._selectedList[_id];
                }
            }
            this.tree.nodes.remove(this);
            _parent && _parent.updateSwitch();
        }
    }
    /**
     * 获取节点对象
     * @param id 节点标识
     * @return
     */
    tree.prototype.getNode = function(selector){
        var _type = $.type(selector);
        if($.isNumeric(selector) || _type == 'string'){
            return this.nodes.find(selector);
        }
        //if(_type == 'string'){
        //    return $(selector).data(tree.cacheMask);
        //}
        if(nodeManage.isNode(selector)){
            return selector;
        }
        if(selector instanceof jQuery){
            return selector.data(tree.cacheMask);
        }
        if(_type == 'object' && ('nodeName' in selector)){
            return $(selector).data(tree.cacheMask);
        }
    }

    /**
     * 创建节点
     * @return
     */
     tree.prototype.createNode = function(data,temp){
        var _nodes = this.nodes.serializeNodeData(data) || {};
        for(var i in _nodes){
            var _parent = this.nodes.parent(_nodes[i]) || this.root;
            tree.createHtml.call(this, _nodes[i], _parent, temp);
            _parent.updateSwitch();
        }
        return this;
     }

    /**
     * 展开树
     * @param id 节点标识
     * @return
     */
    tree.prototype.open = function(selector){
        var node = this.getNode(node);
        if(nodeManage.isNode(node)){
            node.open(status);
        }
        return this;
    }

    /**
     * 关闭树
     * @param id 节点标识
     * @return
     */
    tree.prototype.close = function(selector){
        var node = this.getNode(node);
        if(nodeManage.isNode(node)){
            node.close(status);
        }
        return this;
    }

    /**
     * 设置选择模式
     * @return
     */
    tree.prototype.setSelectMode = function(mode){
        var _modes = ['single', 'multiple'],
            _mode  = $.inArray(mode, _modes) >= 0 ? mode : _modes[0];
        this._selectMode = _mode;
        return this;
    }

    /**
     * 获取选择模式
     * @return
     */
    tree.prototype.getSelectMode = function(){
        return this._selectMode;
    }

    /**
     * 设置选择是否必须
     * @return
     */
    tree.prototype.setSelectMust = function(status){
        this._selectMust = typeof status == 'undefined' ? true : status ? true : false;
        return this;
    }

    /**
     * 获取选择模式
     * @return
     */
    tree.prototype.getSelectMust = function(){
        return this._selectMust;
    }


    /**
     * 选择树节点
     * @param node 节点
     * @param status 选择状态 true选中，false取消选中
     * @return
     */
    tree.prototype.selected = function(node, status, lockEvent){
        var node = this.getNode(node);
        if(nodeManage.isNode(node)){
            node.selected(status, lockEvent);
        }
        return this;
    }

    /**
     * 获取当前选中的节点
     * @return
     */
    tree.prototype.getSelected = function(){
        var _selected = [];
        for(var i in this._selectedList){
            _selected.push(this._selectedList[i]);
        }
        if(this._selectMode == 'single'){
            return _selected[0];
        }
        return _selected;
    }

    tree.prototype.setParseTemp = function(temp){
        var _temp = temp, _self = this;
        if(!$.isFunction(_temp)){
            _temp = function(node){
                return '<span class="tree-text">'+tree.HTMLEnCode(node.get(_self.options.displayField))+'</span>';
            }
        }
        this._parseTemp = _temp;
    }

    tree.prototype.getParseTemp = function(){
        return this._parseTemp;
    }

    //实体转码
    tree.HTMLEnCode = function(str){
        var    s    =    "";
        if    (str.length    ==    0)    return    "";
        s    =    str.replace(/&/g,    "&gt;");
        s    =    s.replace(/</g,        "&lt;");
        s    =    s.replace(/>/g,        "&gt;");
        s    =    s.replace(/ /g,        "&nbsp;");
        s    =    s.replace(/\'/g,      "'");
        s    =    s.replace(/\"/g,      "&quot;");
        return    s;
    }
    //实体解码
    tree.HTMLDeCode = function(str){
        var    s    =    "";
        if    (str.length    ==    0)    return    "";
        s    =    str.replace(/&gt;/g,    "&");
        s    =    s.replace(/&lt;/g,        " <");
        s    =    s.replace(/&gt;/g,        ">");
        s    =    s.replace(/&nbsp;/g,        "    ");
        s    =    s.replace(/'/g,      "\'");
        s    =    s.replace(/&quot;/g,      "\"");
        return    s;
    }

    /**
     * 创建树结构
     * @param id 节点标识
     * @return
     */
    tree.createHtml = function(nodes,parent,temp){
        var _nodes = nodes,
            _leng = nodes.length,
            _temp = $.isFunction(temp) ? temp : this.getParseTemp();
        if(nodeManage.isNode(nodes)){
            var _li = createItem.call(this,nodes);
            if(parent.isRoot){
                parent['childrenElement'] = parent['element'];
            }else{
                if(!parent['childrenElement']){
                    parent['childrenElement'] = $('<ul></ul>');
                    parent['element'].parent().append(parent['childrenElement']);
                }
            }
            _li.appendTo(parent['childrenElement']);
        }else{
            for(var i in _nodes){
                var _li = _nodes[i]['element'];
                var _hasChildren = _nodes[i].hasChildren();
                if(!_li){
                    _li = createItem.call(this,_nodes[i]);
                    if(_hasChildren){
                        _nodes[i]['childrenElement'] = $('<ul></ul>');
                        _li.append(arguments.callee.call(this, _nodes[i].getChildren(), _nodes[i]['childrenElement']));
                    }
                }
                _li.appendTo(parent);
            }
        }
        function createItem(node){
            var _item = '';
            var _li = $('<li/>');
            _item += '<span class="tree-item">';
            for(var j = 0; j < node.getLevel(); j++){
                _item += '<i class="tree-block"></i>';
            }
            _item += '<b class="tree-switch';
            _item += _hasChildren ? ' tree-switch-active' : '';
            _item += '"><i>开关</i></b>';
            _item += '</span>';
            _item = $(_item);
            _item.append(_temp(node));
            _item.appendTo(_li);
            _item.data(tree.cacheMask, node);
            node['element'] = _item;
            (function(node,element){
                element.click(function(){
                    node.selected();
                });
                element.find('.tree-switch').click(function(event){
                    node.tree.trigger('onSwitch', node);
                    event.stopPropagation();
                });
            })(node,_item);
            return _li;
        }
        return parent;
    }
    tree.options = {
        cls: 'think-tree', //样式名称
        combobox: null, //组合框元素
        selectMode: 'single', //选择模式
        selectMust: false, //当存在选择时，至少保留选择一个(只对单选有效)
        parentField: 'pid', //父级字段标识
        childField: 'id', //子级字段标识
        displayField: 'text', //内容显示字段
        appendTo: null, //添加到指定元素中，默认为$('body')元素
        onSelect: null, //选择节点时响应回调函数
        parseData: null, //解析数据源函数
        parseTemp : null, //返回模版函数
        onCreate: null //控件初始化完毕相应回调函数
    }
    $.tree = function(data, options) {
        return new tree(data, options)
    }
    $.serializeTree = node.serialize;
})(jQuery);
