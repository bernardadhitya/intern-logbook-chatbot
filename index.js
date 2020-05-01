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

async function fill(){
    let url = {
        loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
        logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
    }
    console.log('Puppeteer starting...');

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto(url.loginPage, {waitUntil: 'networkidle2'});

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

    fill();
    return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});