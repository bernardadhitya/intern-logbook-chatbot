'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

const Controller = require('./controller');

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

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    //run the commands via controller
    const controller = new Controller(event.message.text);
    const replyText = controller.run();

    //reply to LINE
    const echo = {
        type: 'text',
        text: replyText
    };

    return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});