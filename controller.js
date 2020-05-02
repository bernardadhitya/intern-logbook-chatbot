'use strict';

const puppeteer = require('puppeteer');
const Help = require('./commands/help');
const Fill = require('./commands/fill.js');
const Show = require('./commands/show.js');

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
        let response = 'in development...';
        switch(this.getCommand()){
            case '/help':
                const help = new Help(this.getMessage());
                console.log('run /help command...');
                response = help.run();
                break;
            case '/fill':
                const fill = new Fill(this.getMessage());
                console.log('run /fill command...');
                response = fill.run();
                break;
            case '/show':
                const show = new Show(this.getMessage());
                console.log('run /show command...');
                response = show.run();
                break;
            default:
                console.log('[ERR!] invalid command');
                response = 'Invalid command! Please write a valid command. You can see list of valid commands with /help';
                break;
        }
        return response;
    }
}

module.exports = Controller;