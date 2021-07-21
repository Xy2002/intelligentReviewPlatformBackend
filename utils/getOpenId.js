const request = require('request')
const appid = 'wx43a3698c6bac5555'
const secret = '25ccfb71bd15ea057fa753735ddd1b7e'
const grant_type = 'authorization_code'

function getOpenId(code) {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}`
    var options = {
        'method': 'GET',
        'url': url,
        'headers': {}
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            //if (error) throw new Error(error);
            if (error) reject(error)
            console.log(response.body)
            resolve(response.body);
        });
    })
}

module.exports={getOpenId}
