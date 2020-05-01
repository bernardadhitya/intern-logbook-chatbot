const line = require('@line/bot-sdk');
const express = require('express');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const app = express();

app.get('/', (req, res) => {
    res.send('There\'s nothing here...');
    res.send(404);
});
app.post('/webhook', line.middleware(config), (req, res) => {
    res.send(200);
});

function mainProgram(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'Hello, world'
    });
}

const port = 3000;
app.listen(port, () => {});