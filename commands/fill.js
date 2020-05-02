'use strict';

const puppeteer = require('puppeteer');

class Fill{
    constructor(msg){
        this.msg = msg;
    }
    getLog(){
        let log = {
            clock: {
                in: "09.00",
                out: "17.00"
            },
            activity: "-",
            description: "-"
        }

        const regex = /\[(.)+\]/;
        const activityFormat = this.msg.match(regex)[0];

        if(this.msg[0] === '[' && activityFormat !== null){
            log.activity = activityFormat.substring(1, activityFormat.length-1);
            log.description = this.msg.substring(activityFormat.length+1);

            if(log.activity.toLowerCase() === 'day off'){
                log.clock.in = '-';
                log.clock.out = '-';
            }
        }
        
        return log;
    }
    run(){
        //validate input
        if(this.msg === ''){
            return '[ERR!] Message cannot be empty! Please fill the log to be inserted into your logbook'
        }

        const regex = /\[(.)+\]/;
        const activityFormat = this.msg.match(regex)[0];
        if(this.msg[0] !== '[' || activityFormat === null){
            return '[ERR!] Message doesn\'t follow the format! Please fill the log with the following format; [<<YOUR_ACTIVITY>>] <<YOUR_DESCRIPTION>>';
        }

        this.fill();
        return 'Your logbook is filled for the day! You may check your logbook on the official website or use /show. Have a nice day!'
    }
    async fill(){
        const data = {
            username: process.env.MY_USERNAME,
            password: process.env.MY_PASSWORD,
            log: this.getLog()
        }
    
        let url = {
            loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
            logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
        }
    
        console.log('Puppeteer starting...');
    
        let browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        let page = await browser.newPage();
    
        await page.goto(url.loginPage, {waitUntil: 'networkidle2'});
    
        //fill login
        await page.evaluate(function(data){
            document.querySelector('input[name="username"]').value = data.username;
            document.querySelector('input[name="password"]').value = data.password;
            document.forms[0].submit();
        }, data);
    
        console.log('Login success!');
        await page.waitFor(5000);
        await page.goto(url.logBookPage, {waitUntil: 'networkidle2'});
    
        //fill logbook
        await page.evaluate(function(data){
            //check if its day off
            document.querySelector('input[name="clock-in"]').value = data.log.clock.in;
            document.querySelector('input[name="clock-out"]').value = data.log.clock.out;
            document.querySelector('input[name="activity"]').value = data.log.activity;
            document.querySelector('textarea').value = data.log.description;
            
            document.forms[4].submit();
        }, data);
    
        console.log('Fill form success!');
        await page.waitFor(5000);
        await browser.close();
        
        console.log('Puppeteer done!');

        console.log(`Fill logbook with "${ this.msg }"`);
    }
}

module.exports = Fill;