const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {verifyToken} = require('../utils/token')
const to = require('await-to-js').default

router.post('/getDetails', async (ctx) => {
    let req = ctx.request.body;
    let {token} = {token: req.token}
    // if (token) {
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT * FROM User WHERE openid = "${openid}"`
        await db.find(query)
            .then(async result => {
                return ctx.send(result)
            })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })
    }
    // }
})

router.post('/addDetails', async (ctx) => {
    let req = ctx.request.body;
    let {
        username,
        avatar,
        phone,
        email,
        token,
        power
    } = {
        username: req.username,
        avatar: req.avatar,
        phone: req.phone,
        email: req.email,
        token: req.token,
        power: req.power
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        console.log(res)
        let openid = res.openid
        let query = `INSERT INTO User(username,avatar,phone,email,power,openid) VALUES(?,?,?,?,?,?)`
        await db.insert(query, [username, avatar, phone, email, power, openid])
            .then(async (result) => {
                console.log(result)
                return ctx.send(result)
            })
            .catch((err) => {
                console.log(err)
                return ctx.sendError('101', "该openid已存在，请不要重复注册");
            })
    }
})


module.exports = router.routes();
