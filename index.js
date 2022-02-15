const { Extension, type, api } = require('clipcc-extension');

class AlertExtension extends Extension {
    openWindow(url,title,width,height){
        window.open(url,title,'width='+width+',height='+height)
        return;
    }

    onInit() {
        api.addCategory({
            categoryId: 'jasonxu.alert.alert',
            messageId: 'jasonxu.alert.alert.messageId',
            color: '#4F6C19'
        });
        api.addBlock({
            opcode: 'jasonxu.alert.confirm.opcode',
            type: type.BlockType.REPORTER,
            messageId: 'jasonxu.alert.confirm',
            categoryId: 'jasonxu.alert.alert',
            function: args => confirm(args.MESSAGE),
            param:{
                MESSAGE:{
                    type: type.ParameterType.STRING,
                    default: 'AlexCui AK IOI?'
                }
            }
        });
        api.addBlock({
            opcode: 'jasonxu.alert.prompt.opcode',
            type: type.BlockType.REPORTER,
            messageId: 'jasonxu.alert.prompt',
            categoryId: 'jasonxu.alert.alert',
            function: args => prompt(args.MESSAGE),
            param:{
                MESSAGE:{
                    type: type.ParameterType.STRING,
                    default: 'What is your name?'
                }
            }
        });
        api.addBlock({
            opcode: 'jasonxu.alert.simple.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.alert.simple',
            categoryId: 'jasonxu.alert.alert',
            function: args => alert(args.MESSAGE),
            param:{
                MESSAGE:{
                    type: type.ParameterType.STRING,
                    default: 'ClipTeam yyds!'
                }
            }
        });
        api.addBlock({
            opcode: 'jasonxu.alert.openWindow.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.alert.openWindow',
            categoryId: 'jasonxu.alert.alert',
            function: args => this.openWindow(args.URL,args.TITLE,args.WIDTH,args.HEIGHT),
            param:{
                URL:{
                    type: type.ParameterType.STRING,
                    default: 'https://codingclip.com'
                },WIDTH:{
                    type: type.ParameterType.STRING,
                    default: '200'
                },HEIGHT:{
                    type: type.ParameterType.STRING,
                    default: '100'
                },TITLE:{
                    type: type.ParameterType.STRING,
                    default: 'NewWindow'
                }
            }
        });
    }

    onUninit(){
        api.removeCategory('jasonxu.alert.alert');
    }
}

module.exports = AlertExtension;
