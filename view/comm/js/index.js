$(function () {
    $('.clock').thooClock({
        size: 160,
        onAlarm:function(){
        },
        showNumerals:true,
        brandText:'THOOYORK',
        brandText2:'Germany',
        onEverySecond:function(){
            //callback that should be fired every second
        },
        //alarmTime:'15:10',
        offAlarm:function(){
        }
    });
    var CMD_TYPE_SYS = 1;
    var CMD_TYPE_ALIGN = 2;
    var CMD_TYPE_UNDEFINED = 0;
    var cmdType = {
        ':': CMD_TYPE_SYS,
        '=': CMD_TYPE_ALIGN
    };
    var data = {};
    var curCmd = {
        type: CMD_TYPE_SYS,
        content: '',
    };
    var params = {};

    var Tool = function (data) {
        this.data = data || {};
        this.$me =$('.tool');
        this.$input = $('.tool input');
        this.$tip = $('.tool .tip');
        this.$list = $('.tool ul');
        this.$cmd = {};
        this.init();
    };
    Tool.prototype = {
        init: function () {
            var self = this;
            $.each(self.data, function (k, v) {
                self.$list.append('<li class="clear"><span>' + v.cmd + '</span><span class="des ">'+ v.des + '</span></li>');
            });
            self.$input.keyup(function(event) {
                var val = $(this).val();
                if(val === '') {
                    self.hide();
                    return true;
                }
                if(event.key === 'Enter') {
                    curCmd.type = getCmdType(val.substr(0, 1));
                    curCmd.content = val.substr(1);
//                        console.log(curCmd);
                    self.hide();
                    self.exec(curCmd);
                }
                var cmd = '';
                if(val.length > 0) {
                    cmd = val.substr(1);
                }
                self.$list.find('li').each(function (k, v) {
                    if(cmd === '' || $(v).find('span:first-child').text().indexOf(cmd) !== -1) {
                        $(v).show();
                    }
                    else {
                        $(v).hide();
                    }
                });
            });
        },
        hide: function () {
            var self = this;
            self.$input.val('');
            self.$me.hide();
            self.$tip.hide();
        },
        tip: function (tip) {
            var self = this;
            self.$tip.text(tip).show();
        },
        show: function (isShowList) {
            var self = this;
            if(isShowList === undefined) {
                isShowList = true;
            }
            if(isShowList) {
                self.$list.show();
            }else {
                self.$list.hide();
            }
            self.$me.show();
            self.$input.focus();
        },
        undefinedCmd: function () {
            var self = this;
            self.show(false);
            self.tip('undefined command');
        },
        exec: function (cmd) {
            var self = this;
            switch (cmd.type) {
                case CMD_TYPE_SYS:
                    switch(cmd.content) {
                        case 'login':
                            self.show(false);
                            self.tip('input your name and password like: name password');
                            self.cmd({
                                type: CMD_TYPE_ALIGN,
                                params: ['name', 'password'],
                            });
                            break;
                        case 'exit':
                            self.hide();
                            break;
                        default:
                            self.undefinedCmd();
                    }
                    break;
                case CMD_TYPE_ALIGN:
                    var values = cmd.content.split(' ');
                    var len = values.length;
                    $.each(self.$cmd.params, function (k, v) {
                        if(k < len) {
                            eval('params.' + v + '="' + values[k] + '"');
                        }else {
                            eval('params.' + v + '=""');
                        }
                    });
                    break;
                default:
                    self.undefinedCmd();
                    break;
            }
        },
        cmd: function (cmd) {
            var self = this;
            self.$cmd = cmd;
            switch (cmd.type) {
                case CMD_TYPE_ALIGN:
                    self.$input.val("=");
                    break;
                case CMD_TYPE_SYS:
                    self.$input.val(':');
                    break;
                default:
                    break;
            }
        }
    };
    var toolData = [
        {
            cmd: 'login',
            des: 'login the system'
        }, {
            cmd: 'logout',
            des: 'logout the system'
        }, {
            cmd: 'exit',
            des: 'exit the tool'
        }
    ];
    initData(toolData);
    var tool = new Tool(toolData);
    $(document).keydown(function(event){
        if(event.shiftKey && event.key === ':') {
            tool.show();
        }
        if(event.key === 'Escape') {
            tool.hide();
        }
    });
    function getCmdType(str) {
        if(cmdType[str]) {
            return cmdType[str];
        }
        return CMD_TYPE_UNDEFINED;
    }
    function initData(toolData) {
        var cmds = [];
        $.each(toolData, function (k, v) {
            cmds.push(v.cmd);
        });
        data.cmds = cmds;
    }

    // bookshelf
    var Bookshelf = function (data) {
        var self = this;
        self.data = data || {};
        self.book = self.data['book'] || [];
        self.itemW = 1060;
        self.itemH = 280;
        self.wList = {
            s: 40, m: 60, l: 80
        };
        self.hList = {
            s: 140, m: 180, l: 220
        };
        self.level = 3;
        self.bookGap = 1;
        self.cList = [
            'cl1', 'cl2', 'cl3', 'cl4',
            'cd1', 'cd2', 'cd3', 'cd4'
        ];
        self.$me = $('.bookshelf');
        self.init();
    };
    Bookshelf.prototype = {
        init: function () {
            var self = this;
            var num = self.level;
            self.level = 0;
            self.addBookshelfItem(num);
        },
        sortBook: function (key, type) {
            var self = this;
            var by = function(name, type){
                if(name === undefined) {
                    throw ('error');
                }
                if(type === undefined || (type !== 'desc' && type !== 'asc')) {
                    type = 'desc';
                }
                return function(o, p){
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = o[name];
                        b = p[name];
                        if (a === b) {
                            return 0;
                        }
                        if (typeof a === typeof b) {
                            if(type === 'asc') {
                                return a < b ? -1 : 1;
                            }
                            return a < b ? 1 : -1;
                        }
                        if(type === 'asc')
                            return typeof a < typeof b ? -1 : 1;
                        return typeof a < typeof b ? 1: -1;
                    }
                    else {
                        throw ("error");
                    }
                }
            };
            self.book.sort(by(key, type));
        },
        updateView: function (book) {
            var self = this;
            self.book = self.book.concat(book);
            self.initBook();
            self.initView();
        },
        initBook: function () {
            var self = this;
            $.each(self.book, function (k, v) {
                if(v.page <=300 ) {
                    v.w = 's';
                } else if (v.page > 300 && v.page <= 600) {
                    v.w = 'm';
                } else {
                    v.w = 'l';
                }
                v.ws = self.wList[v.w];
                if(v.name.length <= 4) {
                    v.h = 's';
                } else if (v.name.length > 4 && v.name.length <= 6) {
                    v.h = 'm';
                } else {
                    v.h = 'l';
                }
                v.hs = self.hList[v.h];
                var index = Math.abs(hash($.md5(v.name))) % (self.cList.length-1);
                v.c = self.cList[index];
            });
            var level = 0;
            var w = 0;
            $.each(self.book, function (k, v) {
                w += self.wList[v.w] + self.bookGap;
                if(w > self.itemW) {
                    level += 1;
                    w = self.wList[v.w];
                }
                v.level = level;
            });
            var levelSize = level +1;
            if(levelSize > self.level) {
                self.addBookshelfItem(levelSize-self.level);
            }
        },
        addBookshelfItem: function (num) {
            var self = this;
            for(var i = 0; i < num; i ++) {
                self.$me.append('<div class="bookshelf-item"></div>');
            }
            self.level += num;
        },
        initView: function () {
            var self = this;
            $.each(self.book, function (k, v) {
                if(v.level > self.level) {
                    self.$me.append('<div class="bookshelf-item"></div>');
                    self.level += 1;
                    console.log(self.$me.find('.bookshelf-item').length);
                }
                self.$me.find('.bookshelf-item').eq(v.level).append('<div class="book ' + v.h + 'h-book ' + v.w + 'w-book ' + v.c + '"><div class="content"><div class="no">' + v.no + '</div><div class="s-title">' + v.name + '</div></div></div>');
            });
            // $('.book').each(function (k, v) {
            //     $(v).hover(function () {
            //         $(this).addClass('book-hover');
            //     }, function () {
            //         $(this).removeClass('book-hover');
            //     });
            // });
        }
    };
    // var bookshelf = new Bookshelf();
    $.post('/book/getbooks', {
        bookNo: ''
    }, function (data) {
        // bookshelf.updateView(data);
    }, "json");

    function hash(str){
        var hash = 0;
        if (str.length == 0) return hash;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }
        return hash;
    }
    $('footer').show();
});
