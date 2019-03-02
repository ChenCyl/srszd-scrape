const puppeteer = require('puppeteer');

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
    await page.screenshot({path: 'schedule.png', clip: { x: 50, y: 150, width: 400, height: 500 }});

    return "success to image"

}

toImage(['1hello\n', '2world\n', '3hello\n', '4world\n','5hello\n', 
'6world\n', '7helloworld\n','7helloworld\n','7helloworld\n','7helloworld\n',
'11helloworld\n','7helloworld\n','7helloworld\n','14helloworld\n','7helloworld\n',
'7helloworld\n','17helloworld\n','7helloworld\n','7helloworld\n','20helloworld\n',
'7helloworld\n','22helloworld\n']).then((result) => {
    console.log(result)
});
