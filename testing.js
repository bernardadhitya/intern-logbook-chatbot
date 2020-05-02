/*
const Controller = require('./controller');

const msg = '/fill Today we work on a new project';
const controller = new Controller(msg);
controller.run();
*/


const msg = 'hello world';

function getLog(){
    let log = {
        clock: {
            in: "09.00",
            out: "17.00"
        },
        activity: "-",
        description: "-"
    }

    const regex = /\[(.)+\]/;
    const activityFormat = msg.match(regex);

    return activityFormat;

    /*
    if(msg[0] === '[' && activityFormat !== null){
        log.activity = activityFormat.substring(1, activityFormat.length-1);
        log.description = msg.substring(activityFormat.length+1);

        if(log.activity.toLowerCase() === 'day off'){
            log.clock.in = '-';
            log.clock.out = '-';
        }
    }
    
    return log;
    */
}

console.log(getLog());


/*
const msg = '/help';

function getMessage(){
    let arr = msg.split(" ");
    arr.shift();
    const text = arr.join(" ");
    return text;
}

console.log(getMessage() === '');
*/


