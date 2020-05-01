'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const puppeteer = require('puppeteer');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

async function fill(msg){
    const data = {
        username: process.env.MY_USERNAME,
        password: process.env.MY_PASSWORD,
        clock: {
            in: "-",
            out: "-"
        },
        activity: "-",
        description: msg
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
        document.querySelector('input[name="clock-in"]').value = data.clock.in;
        document.querySelector('input[name="clock-out"]').value = data.clock.out;
        document.querySelector('input[name="activity"]').value = data.activity;
        document.querySelector('textarea').value = data.description;
        
        document.forms[4].submit();
    }, data);

    console.log('Fill form success!');
    await page.waitFor(5000);
    await browser.close();
    
    console.log('Puppeteer done!');
}

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    const echo = {
        type: 'text',
        text: 'Your message "' + event.message.text + '" has been processed!'
    };

    fill(event.message.text);
    return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});