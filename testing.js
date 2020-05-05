/*
const Controller = require('./controller');

const msg = '/fill Today we work on a new project';
const controller = new Controller(msg);
controller.run();
*/

/*
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

    if(msg[0] === '[' && activityFormat !== null){
        log.activity = activityFormat.substring(1, activityFormat.length-1);
        log.description = msg.substring(activityFormat.length+1);

        if(log.activity.toLowerCase() === 'day off'){
            log.clock.in = '-';
            log.clock.out = '-';
        }
    }
    
    return log;
}

console.log(getLog());
*/

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

/*
const msg = '03/05/2020';

function isValid(){
    const regex = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
    const dateFormat = msg.match(regex);
    if(dateFormat === null){
        return false;
    }
    return true;
}

console.log(isValid());
*/

/*
const msg = '03/05/2020';

function getMonth(){
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
    return months[Number(msg.split('/')[1])-1];
}

console.log(getMonth());
*/


// const Show = require('./commands/show.js');
// const show = new Show('03/03/2020');

// console.log(show.run());


// const msg = 'Fri, 03/05/1999';
// console.log(msg.split(', ')[1]);

//console.log(show.getMonth());


const Controller = require('./controller.js');
const controller = new Controller('/show 03/04/2020');
console.log(controller.run());
