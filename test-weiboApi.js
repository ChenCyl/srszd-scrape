const axios = require('axios')
const key = require("./key.js")
const fs = require("fs")

let value = ["hello", "world", "http://etmskies.com"]
let status = encodeURI(value.join('\n'))
let data = {
    access_token: key.token,
    status: status
}

let pic = fs.readFileSync('schedule.png');
let base64str = new Buffer(pic.toJSON())
console.log("同步读取: " + base64str);
console.log("程序执行完毕。");

let url = 'https://api.weibo.com/2/statuses/share.json?access_token=' + key.token + '&status=' + status
+ '&pic=' + pic
axios.post(url, null, {
    headers: {
        'Content-Type': 'multipart/form-data',
    }
})
    .then(response => {

        console.log("Share to weibo successfully");
    }).catch(err => {
        console.log(err)
    })
// let url = 'https://api.weibo.com/2/statuses/share.json'
// axios.post(url, JSON.stringify(data), {
       
//     })
//     .then(response => {
//         console.log("Share to weibo successfully");
//     }).catch(err => {
//         console.log(err)
//     })

// axios.post('/user', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });