const puppeteer = require('puppeteer');
const fs = require('fs');
let completeLog = require('../logs/data.json');
let listOfHolidays = require('../logs/listOfHolidays.json');
//require ('dotenv').config();

Date.prototype.formattedDate = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [(dd>9 ? '' : '0') + dd,
            (mm>9 ? '' : '0') + mm,
            this.getFullYear(),
           ].join('/');
};

(async () => {
    let data = {
        username: process.env.MY_USERNAME,
        password: process.env.MY_PASSWORD,
        log: {
            date: '',
            clock: {
                in: "-",
                out: "-"
            },
            activity: "-",
            description: "-"
        }
    }
    
    let url = {
        loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
        logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
    }

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

    await page.waitFor(5000);
    await page.goto(url.logBookPage, {waitUntil: 'networkidle2'});

    //collect all data
    let allLogs = await page.evaluate(function(){
        let allLogs = [];

        const container = document.querySelector('#log-book-tab');
        const logs = container.querySelectorAll('.tab table tbody tr');

        for(let j=0; j<logs.length; j++){
            let log = {
                date: '',
                clock: {
                    in: 'n/a',
                    out: 'n/a'
                },
                activity: 'n/a',
                description: 'n/a'
            }

            
            let date = logs[j].querySelector('td.date').innerText;
            date = date.split(', ')[1];
            log.date = date;

            log.clock.in = logs[j].querySelector('td.clock-in').innerText;
            if(log.clock.in === ''){
                break;
            }
            log.clock.out = logs[j].querySelector('td.clock-out').innerText;
            log.activity = logs[j].querySelector('td.activity').innerText;
            log.description = logs[j].querySelector('td.description').innerText;
            
            allLogs.push(log);
        }
        return allLogs;
    });

    let today = new Date(Date.now());
    let currDate = today.formattedDate();

    //check if the today's log is filled
    if(allLogs[allLogs.length-1].date !== currDate){
        //check if there is a certain holiday
        if(currDate in listOfHolidays){
            data.log.date = currDate;
            data.log.clock.in = '-';
            data.log.clock.out = '-';
            data.log.activity = listOfHolidays[currDate];
            data.log.description = listOfHolidays[currDate];
        }
        //check if yesterday was a Day Off (Monday)
        else if(today.getDay() == 1){
            const lastData = allLogs[allLogs.length-3];

            data.log.date = currDate;
            data.log.clock.in = lastData.clock.in;
            data.log.clock.out = lastData.clock.out;
            data.log.activity = lastData.activity;
            data.log.description = lastData.description;
        }
        //fill today's log with yesterday's log
        else{
            const lastData = allLogs[allLogs.length-1];

            data.log.date = currDate;
            data.log.clock.in = lastData.clock.in;
            data.log.clock.out = lastData.clock.out;
            data.log.activity = lastData.activity;
            data.log.description = lastData.description;
        }
        await page.evaluate(function(data){
            document.querySelector('input[name="clock-in"]').value = data.log.clock.in;
            document.querySelector('input[name="clock-out"]').value = data.log.clock.out;
            document.querySelector('input[name="activity"]').value = data.log.activity;
            document.querySelector('textarea').value = data.log.description;
            document.forms[4].submit();
        }, data);

        allLogs.push(data.log);
    }
    

    completeLog.data.length = 0;
    for(let i=0; i<allLogs.length; i++){
        completeLog.data.push(allLogs[i]);
    }
    
    await page.waitFor(5000);
    await browser.close();

    fs.writeFile('./logs/data.json', JSON.stringify(completeLog, null, 4), err => err ? console.log(err) : null);
})();