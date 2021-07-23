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
        }).catch(err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/getProjectDetailInfo', async (ctx) => {
    let req = ctx.request.body;
    let {
        matchID,
        token
    } = {
        matchID: req.matchID,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    res[0].matchOptions = JSON.parse(res[0].matchOptions)
                    return ctx.send(res)
                }
            } catch (e) {
                return ctx.sendError('101', e)
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
    console.log(req)
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
        matchID: req.matchID,
        token: req.token
    }
    console.log(JSON.stringify(req.matchOptions).toString())
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    let query = `UPDATE MatchInfo SET matchName="${matchName}",description="${description}",startTime="${startTime}",creatorName="${creatorName}",matchOptions='${matchOptions}' WHERE id="${matchID}"`
                    try {
                        let result = await db.update(query)
                        console.log(result)
                        return ctx.send(result)
                    } catch (e) {
                        console.log(e)
                        return ctx.sendError('101', e)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/endProject', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let {
        matchID,
        token
    } = {
        matchID: req.matchID,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    let query = `UPDATE MatchInfo SET status="1" WHERE id="${matchID}"`
                    try {
                        let result = await db.update(query)
                        console.log(result)
                        return ctx.send(result)
                    } catch (e) {
                        console.log(e)
                        return ctx.sendError('101', e)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/joinProject', async (ctx) => {

    let req = ctx.request.body;
    let {
        code,
        token
    } = {
        code: req.code,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let query2 = `SELECT * FROM MatchInfo WHERE code = "${code}"`
            try {
                let res = await db.find(query2);
                let matchID = res[0].id
                let query3 = `SELECT * FROM Project WHERE matchID = "${matchID}"`
                let query4 = `SELECT * FROM Rule WHERE matchID = "${matchID}"`
                let res2 = await db.find(query3)
                let res3 = await db.find(query4)
                console.log(res, res2, res3)
                let newObj={}
                res[0].matchOptions = JSON.parse(res[0].matchOptions)
                newObj.matchInfo = res[0]
                newObj.projectInfo = res2
                newObj.ruleInfo = res3
                return ctx.send(newObj)

            } catch (e) {
                console.log(e)
                return ctx.sendError('101', e.message)
            }
        })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })

    }

})

module.exports = router.routes();
