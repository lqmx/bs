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
            self.initEvt();
        },
        initEvt: function () {
            $('.book').click(function () {
                var no = $(this).find('.no').text();
                window.location.href = "/book.html";
            });
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
                // var index = Math.abs(hash($.md5(v.name))) % (self.cList.length-1);
                // v.c = self.cList[index];
                v.c = 'c-'  + v.type;
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
                self.$me.find('.bookshelf-item').eq(v.level).append(
                    '<div class="book ' + v.h + 'h-book ' + v.w + 'w-book ' + v.c + '">' +
                    '<div class="content">' +
                    '<div class="no">' + v.no + '</div>' +
                    '<div class="s-title">' + v.name + '</div>' +
                    '</div>' +
                    '</div>');
            });
        }
    };
    var bookshelf = new Bookshelf();
    // $.get('/book/getbooks', {
    //     bookNo: ''
    // }, function (data) {
    //     bookshelf.updateView(data);
    // }, "json");

    $.getJSON("data/data.json", function (data) {
        bookshelf.updateView(data);
    });

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
