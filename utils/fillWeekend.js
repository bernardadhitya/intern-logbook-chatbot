const puppeteer = require('puppeteer');
//require ('dotenv').config();

(async () => {
    const data = {
        username: process.env.MY_USERNAME,
        password: process.env.MY_PASSWORD,
        clock: {
            in: "-",
            out: "-"
        },
        activity: "Day Off",
        description: "Day Off"
    }

    let url = {
        loginPage: 'https://industry.socs.binus.ac.id/learning-plan/auth/login',
        logBookPage: 'https://industry.socs.binus.ac.id/learning-plan/student/log-book'
    }

    let browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
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
        //check if its day off
        let currDate = new Date(Date.now());
        if(currDate.getDay() == 0 || currDate.getDay() == 6){
            document.querySelector('input[name="clock-in"]').value = data.clock.in;
            document.querySelector('input[name="clock-out"]').value = data.clock.out;
            document.querySelector('input[name="activity"]').value = data.activity;
            document.querySelector('textarea').value = data.description;
            document.forms[4].submit();
        }
    }, data);

    await page.waitFor(5000);
    await browser.close();
})();