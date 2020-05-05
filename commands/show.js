'use strict';

class Show{
    constructor(msg){
        this.msg = msg;
    }
    run(){
        //validation
        const regex = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/;
        const dateFormat = this.msg.match(regex);
        if(dateFormat === null){
            return '[ERR!] Invalid input';
        }
        return 'in development...';
    }
}

module.exports = Show;