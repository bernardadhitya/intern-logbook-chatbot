'use strict';

const puppeteer = require('puppeteer');

class Show{
    constructor(msg){
        this.msg = msg;
    }
    isValid(){
        const regex = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
        const dateFormat = this.msg.match(regex);
        if(dateFormat === null){
            return false;
        }
        return true;
    }
    getMonth(){
        const months = ['January', 
                        'February', 
                        'March', 
                        'April', 
                        'May', 
                        'June', 
                        'July', 
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'    
                    ]
        return months[Number(this.msg.split('/')[1])-1];
    }
    run(){
        const regex = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
        const dateFormat = this.msg.match(regex);
        if(dateFormat === null){
            return '[ERR!] Invalid input';
        }
        this.show();
        return '...';
    }
    async show(){
        /*
        const data = {
            username: process.env.MY_USERNAME,
            password: process.env.MY_PASSWORD,
            month: this.getMonth(),
            date: this.msg
        }
         */
        const data = {
            username: '2101657070',
            password: '03051999',
            month: this.getMonth(),
            date: this.msg
        }

        let url = {
            loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
            logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
        }

        console.log('Puppeteer starting...');
    
        let browser = await puppeteer.launch({
            headless: false,
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

        let log = await page.evaluate(function(data){
            //click the matching month tab
            const month = data.month;
            const monthTabs = document.querySelectorAll('div[class="ui top attached tabular menu"] a.item');
            for(let i=0; i< monthTabs.length; i++){
                if(monthTabs[i].innerText === month){
                    monthTabs[i].click();
                    break;
                }
            }

            const date = data.date;
            let log = {
                clock: {
                    in: '',
                    out: ''
                },
                activity: '',
                description: ''
            }
            const logs = document.querySelectorAll('div[class="ui bottom  attached tab segment active"] table tbody tr');
            for(let i=0; i< logs.length; i++){
                let logDate = logs[i].querySelector('td.date').innerText;
                logDate = logDate.split(', ')[1];
                if(logDate === date){
                    log.clock.in = logs[i].querySelector('td.clock-in').innerText;
                    log.clock.out = logs[i].querySelector('td.clock-out').innerText;
                    log.activity = logs[i].querySelector('td.activity').innerText;
                    log.description = logs[i].querySelector('td.description').innerText;
                    break;
                }
            }
            return log;
        }, data);

        console.log(log);
        await browser.close();
    }
}

module.exports = Show;