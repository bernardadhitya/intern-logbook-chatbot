'use strict';

const puppeteer = require('puppeteer');
const Help = require('./commands/help');
const Fill = require('./commands/fill.js');

class Controller{
    constructor(msg){
        this.msg = msg
    }
    getCommand(){
        return this.msg.split(" ")[0];
    }
    getMessage(){
        let arr = this.msg.split(" ");
        arr.shift();
        const text = arr.join(" ");
        return text;
    }
    run(){
        switch(this.getCommand()){
            case '/help':
                const help = new Help();
                console.log('run /help command...');
                help.run();
                break;
            case '/fill':
                const fill = new Fill(this.getMessage());
                console.log('run /fill command...');
                fill.run();
                break;
            case '/show':
                console.log('run /show command...');
                break;
            default:
                console.log('[ERR!] invalid command');
                break;
        }
    }
}

module.exports = Controller;