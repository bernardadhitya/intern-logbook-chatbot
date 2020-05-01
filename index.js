'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
//const puppeteer = require('puppeteer');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

/*async function fill(desc){
    const data = {
        username: process.env.MY_USERNAME,
        password: process.env.MY_PASSWORD,
        clock: {
            in: "09.00",
            out: "17.00"
        },
        activity: "",
        description: desc
    }
    
    let url = {
        loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
        logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
    }

    let browser = await puppeteer.launch();
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

    //fill logbook
    await page.evaluate(function(data){
        document.querySelector('input[name="clock-in"]').value = data.clock.in;
        document.querySelector('input[name="clock-out"]').value = data.clock.out;
        document.querySelector('input[name="activity"]').value = data.activity;
        document.querySelector('textarea').value = data.description;
        document.forms[4].submit();
    }, data);

    await page.waitFor(5000);
    await browser.close();
}*/

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = { type: 'text', text: event.message.text };
  //await fill(message.text);

  return client.replyMessage(event.replyToken, echo.text);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});