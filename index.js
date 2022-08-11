const { Extension, type, api } = require('clipcc-extension');

class CandyBucket {
    constructor(candy = 5, refresh = 20 * 1000) {
        this._currentCandy = candy;
        this._full = candy;
        setInterval(() => {
            if (this._currentCandy < this._full) {
                this._currentCandy++;
            }
        }, refresh);
    }

    get isEmpty() {
        /*if (this._currentCandy === 0) return true;
        else {
            this._currentCandy --;
            return false;
        }*/
        return false;//取消次数限制
    }
}


class AlertExtension extends Extension {
    onInit() {
        const { version } = api.getVmInstance().runtime;
        const isOffline = version.includes(' ') && !version.startsWith('c')//检测是否为桌面版
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
            param: {
                TITLE: {
                    type: type.ParameterType.STRING,
                    default: 'Here\'s an example'
                },
                MESSAGE: {
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
                if (!bucket.isEmpty) {
                    if (!isOffline) return prompt(args.MESSAGE);//桌面版不支持prompt
                    else return NaN;
                }
            },
            param: {
                MESSAGE: {
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
            param: {
                TITLE: {
                    type: type.ParameterType.STRING,
                    default: 'Dannr yyds'
                },
                MESSAGE: {
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
                if (window.clipAlert) {
                    if (alerting) return;
                    if (!bucket.isEmpty) {
                        allow = new Promise(resolve => {
                            alerting = true;
                            clipAlert('提示', '项目正在尝试打开新窗口：' + args.URL)
                                .then(result => {
                                    alerting = false;
                                    if (result) window.open(args.URL, args.TITLE, 'width=' + args.WIDTH + ',height=' + args.HEIGHT);
                                });
                        });
                    }
                }
                else if (!bucket.isEmpty) {
                    if (confirm('项目正在尝试打开新窗口：' + args.URL)) window.open(args.URL, args.TITLE, 'width=' + args.WIDTH + ',height=' + args.HEIGHT);
                }
                return;
            },
            param: {
                URL: {
                    type: type.ParameterType.STRING,
                    default: 'https://codingclip.com'
                }, WIDTH: {
                    type: type.ParameterType.STRING,
                    default: '200'
                }, HEIGHT: {
                    type: type.ParameterType.STRING,
                    default: '100'
                }, TITLE: {
                    type: type.ParameterType.STRING,
                    default: 'NewWindow'
                }
            }
        });

        api.addBlock({
            opcode: 'jasonxu.alert.setUrl.opcode',
            type: type.BlockType.COMMAND,
            messageId: 'jasonxu.alert.setUrl',
            categoryId: 'jasonxu.alert.alert',
            function: args => {
                if (window.clipAlert) {
                    if (alerting) return;
                    if (!bucket.isEmpty) {
                        allow = new Promise(resolve => {
                            alerting = true;
                            clipAlert('提示', '项目正在尝试跳转到新页面' + args.URL)
                                .then(result => {
                                    alerting = false;
                                    if (result) window.location.href = args.URL;
                                    return;
                                });
                        });
                    }
                }
                else if (!bucket.isEmpty) {
                    if (confirm('项目正在尝试跳转到新页面：' + args.URL)) window.location.href = args.URL;
                }
                return;
            },
            param: {
                URL: {
                    type: type.ParameterType.STRING,
                    default: 'https://codingclip.com'
                }
            }
        });
    }

    onUninit() {
        api.removeCategory('jasonxu.alert.alert');
    }
}

module.exports = AlertExtension;
