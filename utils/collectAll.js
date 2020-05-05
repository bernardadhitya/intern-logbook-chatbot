const puppeteer = require('puppeteer');
const fs = require('fs');
let completeLog = require('../logs/data.json');
require ('dotenv').config();

async function main(){
    const data = {
        username: process.env.MY_USERNAME,
        password: process.env.MY_PASSWORD,
        clock: {
            in: "-",
            out: "-"
        },
        activity: "Day Off",
        description: "Day Off"
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
        const today = new Date();
        const currDate =
                    (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) + '/' + 
                    (today.getMonth() < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1) + '/' + 
                    today.getFullYear();

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

            if(date === currDate){
                break;
            }

            log.clock.in = logs[j].querySelector('td.clock-in').innerText;
            log.clock.out = logs[j].querySelector('td.clock-out').innerText;
            log.activity = logs[j].querySelector('td.activity').innerText;
            log.description = logs[j].querySelector('td.description').innerText;
            
            allLogs.push(log);
        }
        return allLogs;
    });

    for(let i=0; i<allLogs.length; i++){
        completeLog.data.push(allLogs[i]);
    }
    
    await page.waitFor(5000);
    await browser.close();

    fs.writeFile('./logs/data.json', JSON.stringify(completeLog, null, 4), err => err ? console.log(err) : null);
};

main();