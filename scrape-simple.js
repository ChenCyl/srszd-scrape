const puppeteer = require('puppeteer');
const axios = require('axios')
const key = require("./key.js")

// 第一个月的日程数
let oneMonthSchedule = 0

let scrape = async () => {

    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://www.etmskies.com/richeng.asp?natureA=4', { waitUntil: 'load', timeout: 100000 });

    while (true) {
        // 测试时间 手动加上onli 类
        await page.waitFor(10000)
        const realTimeScheduleNum = await page.evaluate(() => {
            let newlength = document.querySelectorAll('.onli').length
            return newlength
        });
        // 如果实时行程数不变则刷新
        if (realTimeScheduleNum == oneMonthSchedule) {
            await console.log("没有新行程，将在 5s 后刷新页面")
            await page.waitFor(5000)
            await page.reload()
        }
        else {
            oneMonthSchedule = await realTimeScheduleNum
            await console.log("有新的行程")
            break
        }
    }
    return null
}


function sharetoWeibo() {
    // 文案
    let text = []
    text.unshift('http://etmskies.com/richeng.asp?natureA=4')
    text.unshift('叮咚！Chic Chili 有新行程了！')
    console.log(text.join('\n'))
    let status = encodeURI(text.join('\n'))
    let url = 'https://api.weibo.com/2/statuses/share.json?access_token=' + key.token + '&status=' + status
    axios.post(url)
        .then(response => {
            console.log("Share to weibo successfully");
        }).catch(err => {
            console.log(err)
        })
}

function scrapeShell() {
    scrape().then((value) => {
        console.log("检测到新的行程，接下来会发布到微博"); // Success!
        sharetoWeibo()
        scrapeShell()
    });
}


scrapeShell()
