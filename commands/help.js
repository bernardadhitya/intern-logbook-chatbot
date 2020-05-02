'use strict';

class Help{
    run(){
        console.log('/help: Show all commands');
        console.log('/fill: Fill logbook for today');
        console.log('/show: Show logbook submissions');
        return  '/help: Show all commands\n' + 
                '/fill: Fill logbook for today\n' + 
                '/show: Show logbook submissions'
    }
}

module.exports = Help;