var CmdTool = (function () {

    var CMD_TYPE_SYS = 1;
    var CMD_TYPE_ALIGN = 2;
    var CMD_TYPE_UNDEFINED = 0;

    var params = {},
        tpl = '<div class="cmd-tool"> <input type="text"> <ul></ul> <div class="tip"></div> </div>';

    var self = this;
    self.$cmdTool = null;
    self.$input = null;
    self.$tip = null;
    self.$list = null;
    self.cmds = [];
    self.cmd = {};
    self.cmdType = {
        ':': CMD_TYPE_SYS,
        '=': CMD_TYPE_ALIGN
    };
    self.curCmd = {
        type: CMD_TYPE_SYS,
        content: ''
    };

    function log(msg) {
        console.log(msg);
    }

    function init(data) {
        $('body').append(tpl);
        self.$cmdTool = $('.cmd-tool');
        self.$input = $cmdTool.find('input');
        self.$tip = $cmdTool.find('.tip');
        self.$list = $cmdTool.find('ul');
        self.cmds = data;
        $.each(data, function (k, v) {
            self.$list.append('<li class="clear"><span>' + v.cmd + '</span><span class="des ">'+ v.des + '</span></li>');
        });
        self.$input.keyup(function(event) {
            var val = $(this).val();
            if(val === '') {
                hide();
                return true;
            }
            if(event.key === 'Enter') {
                curCmd.type = cmdType[val.substr(0, 1)];
                curCmd.content = val.substr(1);
                hide();
                exec(curCmd);
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
        $(document).keydown(function(event){

            // todo 绑定按键目前有bug
            if(event.key === 'i') {
                unBindKey()
            }
            if(event.key === 'Escape') {
                CmdTool.hide();
                bindKey();
            }
        });
        log('init');
    }

    function bindKey() {
        $(document).keydown(function(event){
            if(event.shiftKey && event.key === ':') {
                CmdTool.show();
            }
        });
    }

    function unBindKey() {
        $(document).keydown(function(event){
            if(event.shiftKey && event.key === ':') {
                return false;
            }
        });
    }

    function hide() {
        self.$input.val('');
        self.$cmdTool.hide();
        self.$tip.hide();
    }

    function tip(tip) {
        self.$tip.text(tip).show();
    }

    function show(isShowList) {
        if(isShowList === undefined) {
            isShowList = true;
        }
        if(isShowList) {
            self.$list.show();
        }else {
            self.$list.hide();
        }
        self.$cmdTool.show();
        self.$input.focus();
    }

    function undefinedCmd() {
        show(false);
        tip('undefined command');
    }

    function exec(cmd) {
        switch (cmd.type) {
            case CMD_TYPE_SYS:
                switch(cmd.content) {
                    case 'login':
                        show(false);
                        tip('input your name and password like: name password');
                        cmdHandle({
                            type: CMD_TYPE_ALIGN,
                            params: ['name', 'password']
                        });
                        break;
                    case 'exit':
                        hide();
                        break;
                    default:
                        undefinedCmd();
                }
                break;
            case CMD_TYPE_ALIGN:
                var values = cmd.content.split(' ');
                var len = values.length;
                $.each(self.cmd.params, function (k, v) {
                    if(k < len) {
                        eval('params.' + v + '="' + values[k] + '"');
                    }else {
                        eval('params.' + v + '=""');
                    }
                });
                break;
            default:
                undefinedCmd();
                break;
        }
    }

    function cmdHandle(cmd) {
        self.cmd = cmd;
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

    return {
        init: init,
        show: show,
        hide: hide
    };
})();