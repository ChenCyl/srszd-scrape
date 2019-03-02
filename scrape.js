const puppeteer = require('puppeteer');
const axios = require('axios')
const key = require("./key.js")

// 第一个月的日程数
let oneMonthSchedule = 0
// // 下一个月的日程数
// let nextMonthSchedule = 0
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

    let events = await []
    let info = await ''
    // 实时行程数改变 模拟点击所有日期 将一个月的所有行程提取
    for (let i = 1; i <= 35; i++) {
        await page.click('body > div.ricC > ul > li:nth-child(' + i + ')')
        // 等待页面渲染
        await page.waitFor(1000)
        info = await page.evaluate(() => {
            // 如果该天有行程
            if (document.getElementsByClassName('rcliq').length > 0) {
                return (document.querySelector('.ricE').innerText)
            }
        });
        if (info) {
            await console.log(info)
            await events.push(info)
        }
    }
    return events
}

let toImage = async (value) => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://fanyi.youdao.com', { waitUntil: 'load', timeout: 100000 });

    for (let item of value) {
        // await page.type('#inputOriginal', item, {delay: 100}); // 输入变慢，像一个用户
        await page.type('#inputOriginal', item)
    }
    // await page.setViewport({width: 500, height: 800})
    await page.waitFor(3000)
    await page.screenshot({ path: 'schedule.png', clip: { x: 50, y: 150, width: 400, height: 500 } });

    console.log("Generate iamge successfully")
    return value

}

function sharetoWeibo(value) {
    value.unshift('http://etmskies.com/richeng.asp?natureA=4')
    value.unshift('【测试】')
    console.log('发到微博中的内容：')
    console.log(value.join('\n'))
    let status = encodeURI(value.join('\n'))
    let url = 'https://api.weibo.com/2/statuses/share.json?access_token=' + key.token + '&status=' + status
    axios.post(url)
        .then(response => {
            console.log("Share to weibo successfully");
        })
}

function scrapeShell() {
    scrape().then((value) => {
        console.log(value); // Success!
        // 把文字转换成图片
        // 因为微博分享有字数限制
        toImage(value).then(result => {
            // 返回的 result 等于 value
            // console.log(result)
            // 微博字数限制我真的佛了
            sharetoWeibo(result)
            scrapeShell()
        })
    });
}


scrapeShell()

// 总结一下这次编码出现的问题
// 原生的 dom 操作在 click 之后页面并没有立即动态添加节点
// 导致之后获取不到动态添加的节点
// 方法：
// 1. 用 setTime 在点击之后暂停一段时间时间
//    此方法的弊端在于 这是一个异步方法 可能会绕进去
// 2. 用 page.click 加上 page.waitFor
//    此方法的弊端在于 click 的选择器不能精确到有日程的天数
//    所以必须每天都点一下 还是会有点麻烦

/*
// 操作DOM
// info1
const info1 = await page.evaluate((length) => {
    // let result = []
    // let date = '20190218'
    // document.getElementsByClassName(ricE).
    // let events = []
    // document.getElementsByClassName('ricC')[0].addEventListener('click', function () {
    //     console.log("Dianl")
    //     events.push(document.querySelector('.ricE').innerText)
    //     console.log(events)
    // })

    // 第一个月的实时日程数
    let newlength = document.querySelectorAll('.onli').length
    if (newlength > length) {
        let def = newlength - length;
        let index = length
        document.querySelectorAll('.onli')[index].click();
        // events.push(document.querySelector('.ricE').innerText)
        // console.log(events)
        // events.push(document.querySelector('.ricE').innerText)
        // console.log(events)

        /**
         * 下面这个用了 setTimeout 我真的觉得很麻烦
         */
/*
(function fiveSeconds(i) {
    if (i < def) {
        setTimeout(function () {
            document.querySelectorAll('.onli')[i].click();
            setTimeout(function () {
                events.push(document.querySelector('.ricE').innerText)
                console.log(events)
                // date = document.querySelector('.ricE_riqi').innerText
                // console.log(date)
                // // 音源 播出 活动 拍摄 其他
                // let kinds = document.querySelectorAll('.rcliq').length
                // for (let j = 0; j < kinds; j++) {
                //     // 子节点应该是 p
                //     for (let x of document.querySelectorAll('.rcliq > .p')) {
                //         events.push(x.innerText)
                //     }
                // }
                // console.log(events)
                if (i == def - 1) {
                    return events
                }
            }, 1000);
            console.log(i++)
            // 返回的对象怎么搞
            fiveSeconds(i); // Redo if n < 5 (and pass n)
        }, 2000);
    }
}(length));

}
else {
return null
// } body > div.ricC > ul > li: nth - child(24)
// body > div.ricC > ul > li: nth - child(1)

}
}, oneMonthSchedule);

*/

// await page.waitFor(200000);
// browser.close();
