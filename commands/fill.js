'use strict';

const puppeteer = require('puppeteer');

class Fill{
    constructor(msg){
        this.msg = msg
    }
    run(){
        console.log(`Fill logbook with "${ this.msg }"`);
    }
}

module.exports = Fill;