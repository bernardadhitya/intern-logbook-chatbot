'use strict';

class Help{
    constructor(msg){
        this.msg = msg;
    }
    run(){
        switch(this.msg){
            case '':
                console.log('show /help');
                return  '/help: Show all commands\n' + 
                        '/fill: Fill logbook for today\n' + 
                        '/show: Show logbook submissions\n\n' +
                        'To see details on each menu, write /help /<<command>>\n'+
                        '(ex: "/help /fill")';
            case '/fill':
                console.log('show /help /fill');
                return  '/fill: Fill logbook for today\n' +
                        'format: /fill [<<YOUR_ACTIVITY>>] <<YOUR_DESCRIPTION>>\n\n' +
                        'If your activity is "Day Off", clock in and out will be left empty. Otherwise it will be filled by default (09.00-17.00)';
            case '/show':
                console.log('show /help /show');
                return  '/show: Show logbook submissions\n' + 
                        'format: /show <<LOG_DATE>>\n' +
                        'LOG_DATE follows the format "dd/mm/yyyy"';
            default:
                console.log('Invalid input for /help');
                return  '[ERR!] Invalid input!';
        }
        
    }
}

module.exports = Help;