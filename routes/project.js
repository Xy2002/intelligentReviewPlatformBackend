const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {verifyToken} = require('../utils/token')
const to = require('await-to-js').default

router.post('/getCreatedProject', async (ctx) => {
    let req = ctx.request.body;
    let {token} = {token: req.token}
    // if (token) {
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let id = result[0].id
            let query2 = `SELECT id,matchName,creatorName,startTime,status FROM MatchInfo WHERE creatorID = "${id}"`
            try {
                let res = await db.find(query2);
                return ctx.send(res)
            } catch (e) {
                return ctx.sendError('101', err)
            }
        })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })
    }
    // }
})

router.post('/addProject', async (ctx) => {
    let req = ctx.request.body;
    let {
        matchName,
        status,
        description,
        startTime,
        code,
        creatorName,
        matchOptions,
        token
    } = {
        matchName: req.matchName,
        status: req.status,
        description: req.description,
        startTime: req.startTime,
        code: req.code,
        creatorName: req.creatorName,
        matchOptions: JSON.stringify(req.matchOptions),
        token: req.token
    }
    console.log(req)
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let id = result[0].id
            let query = `INSERT INTO MatchInfo(matchName,creatorID,matchOptions,status,description,startTime,code,creatorName) VALUES(?,?,?,?,?,?,?,?)`
            await db.insert(query, [matchName, id, matchOptions, status, description, startTime, code, creatorName])
                .then(async (result) => {
                    console.log(result)
                    return ctx.send(result)
                })
                .catch(async (err) => {
                    console.log(err)
                    return ctx.sendError('101', err)
                })
        })
        // await db.insert(query, [username, avatar, phone, email, power, openid])
        //     .then(async (result) => {
        //         console.log(result)
        //         return ctx.send(result)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         return ctx.sendError('101', "该openid已存在，请不要重复注册");
        //     })
    }
})

router.post('/getProjectDetailInfo',async (ctx)=>{
    let req = ctx.request.body;
    let {
        matchID,
        token
    }={
        matchID:req.matchID,
        token:req.token
    }
    const [err, res] = await to(verifyToken(token))
    if(err){
        return ctx.sendError('100', 'token已过期，请重新生成')
    }else{
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if(res[0].creatorID !== userID){
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                }else{
                    res[0].matchOptions = JSON.parse(res[0].matchOptions)
                    return ctx.send(res)
                }
            } catch (e) {
                return ctx.sendError('101', err)
            }
        })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })

    }
})

//UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson'
router.post('/updateProject', async (ctx) => {
    let req = ctx.request.body;
    let {
        matchName,
        description,
        startTime,
        creatorName,
        matchOptions,
        matchID,
        token
    } = {
        matchName: req.matchName,
        description: req.description,
        startTime: req.startTime,
        creatorName: req.creatorName,
        matchOptions: JSON.stringify(req.matchOptions),
        matchID:req.matchID,
        token: req.token
    }
    console.log(req)
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let id = result[0].id

            //UPDATE t_user SET pass = "321" WHERE username = "whg"
            let query = `UPDATE MatchInfo SET matchName="${matchName}",description="${description}",startTime="${startTime}",creatorName="${creatorName}",matchOptions="${matchOptions}" WHERE id="${matchID}"`
            await db.update(query)
                .then(async (result) => {
                    console.log(result)
                    return ctx.send(result)
                })
                .catch(async (err) => {
                    console.log(err)
                    return ctx.sendError('101', err)
                })
        })
    }
})


module.exports = router.routes();
