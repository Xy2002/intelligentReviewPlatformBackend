const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {generateToken, verifyToken} = require('../utils/token')
const {getOpenId} = require('../utils/getOpenId')


router.post('/getToken', async (ctx) => {
    let req = ctx.request.body;
    let code = req.code;
    await getOpenId(code)
        .then(async (result) => {
            let res = JSON.parse(result)
            let openId = res.openid;
            //sessionkey = res.sessionkey
            let token = generateToken(openId)
            console.log(token)
            return ctx.loginsend(token);
        })
})


router.post('/perfectInformation', async (ctx) => {
    let req = ctx.request.body;
    let {
        username,
        phone,
        email,
        code,
        power
    } = {
        username: req.username,
        phone: req.phone,
        email: req.email,
        code: req.code,
        power: req.power
    }
    await getOpenId(code)
        .then(async (result)=>{
            let res = JSON.parse(result)
            let openId = res.openid;
            let token = generateToken(username,phone,email)
            let obj = new Object();
            obj.token = token;
            obj.power = power;
            obj.openId = openId;
            return new Promise(resolve => {
                resolve(obj)
            })
        }).then(async (obj)=>{
            let{
                token,
                power,
                openId
            }={
                token:obj.token,
                power:obj.power,
                openId:obj.openId,
            }
            let query = `INSERT INTO mini_program(token,power,openId) VALUES(?,?,?)`
            await db.insert(query,[token,power,openId])
                .then(async (result)=>{
                    return await ctx.send(result);
                })
            }
        )
        .catch((err)=>{
            return ctx.sendError('101', err.message);
        })
})


module.exports=router.routes();
