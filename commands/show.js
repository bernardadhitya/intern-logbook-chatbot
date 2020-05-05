'use strict';
const logs = require('../logs/data.json').data;
class Show{
    constructor(msg){
        this.msg = msg;
    }
    run(){
        //validation
        const regex = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
        const dateFormat = this.msg.match(regex);
        if(dateFormat === null){
            return '[ERR!] Please input date to show!';
        }
        const logsFound = logs.filter(log => log.date === this.msg);
        if(logsFound.length === 0){
            return '[ERR!] No log exist on the date you stated! Please try again'
        }
        const found = logsFound[0];
        return  'in: ' + found.clock.in + '\n' +
                'out: ' + found.clock.out + '\n' +
                '-----' + '\n' +
                '[' + found.activity + ']' + '\n' +
                found.description;
    }
}

module.exports = Show;