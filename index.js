const { Extension, type, api } = require('clipcc-extension');

class CandyBucket {
    constructor (candy = 5, refresh = 20 * 1000) {
        this._currentCandy = candy;
        this._full = candy;
        setInterval(() => {
            if (this._currentCandy < this._full) {
                this._currentCandy ++;
            }
        }, refresh);
    }
    
    get isEmpty () {
        if (this._currentCandy === 0) return true;
        else {
            this._currentCandy --;
            return false;
        }
    }
}


class AlertExtension extends Extension {
    openWindow(url,title,width,height){
        window.open(url,title,'width='+width+',height='+height)
        return;
    }

    onInit() {
        const { version } = api.getVmInstance().runtime;
        const isCommunity = version.startsWith('c');
        const bucket = new CandyBucket();
        let alerting = false;
        
        api.addCategory({
            categoryId: 'jasonxu.alert.alert',
            messageId: 'jasonxu.alert.alert.messageId',
            color: '#4F6C19'
        });
        api.addBlock({
            opcode: 'jasonxu.alert.confirm.opcode',
            type: type.BlockType.BOOLEAN,
            messageId: 'jasonxu.alert.confirm',
            categoryId: 'jasonxu.alert.alert',
            function: args => {
                if (window.clipAlert) {
                    if (alerting) return;
                    if (!bucket.isEmpty) {
                        return new Promise(resolve => {
                            alerting = true;
                            clipAlert(args.TITLE, args.MESSAGE)
                                .then(result => {
                                    alerting = false;
                                    resolve(result);
                                });
                        });
                    }
                }
                if (!bucket.isEmpty) return confirm(args.MESSAGE);
            },
            param:{
                TITLE:{
                    type: type.ParameterType.STRING,
                    default: 'Here\'s an example'
                },
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
            function: args => {
                if (!bucket.isEmpty) return prompt(args.MESSAGE);
            },
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
            function: args => {
                if (window.clipAlert) {
                    if (alerting) return;
                    if (!bucket.isEmpty) {
                        return new Promise(resolve => {
                            alerting = true;
                            clipAlert(args.TITLE, args.MESSAGE)
                                .then(() => {
                                    alerting = false;
                                    resolve();
                                });
                        });
                    }
                }
                if (!bucket.isEmpty) return alert(args.MESSAGE);
            },
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
            function: args => {
                if (!isCommunity) {
                    this.openWindow(args.URL,args.TITLE,args.WIDTH,args.HEIGHT);
                } else {
                    console.warn('open window is unavailable in community version');
                }
            },
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
