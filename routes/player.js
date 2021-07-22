const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {verifyToken} = require('../utils/token')
const to = require('await-to-js').default

router.post('/addPlayer', async (ctx) => {
    let req = ctx.request.body
    let {
        matchID,
        playerName,
        projectName,
        token
    } = {
        matchID: req.matchID,
        playerName: req.playerName,
        projectName: req.projectName,
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
                    let query = `INSERT INTO Project(playerName,projectName,matchID) VALUES (?,?,?) `
                    try {
                        let result = await db.insert(query, [playerName, projectName, matchID])
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
        })
    }
})

router.post('/getPlayerList', async (ctx) => {
    let req = ctx.request.body
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
            try {
                let query = `SELECT * From Project WHERE MatchID=${matchID}`
                try {
                    let result = await db.find(query)
                    return ctx.send(result)
                } catch (e) {
                    console.log(e)
                    return ctx.sendError('101', e)
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(async err => {return ctx.sendError('101',"你不是本系统的用户，请不要试图越权操作！")})
    }
})

router.post('/updatePlayer', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let {
        matchID,
        playerName,
        projectName,
        token
    } = {
        matchID: req.matchID,
        playerName: req.playerName,
        projectName: req.projectName,
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
                    let query = `UPDATE Project SET playerName="${playerName}",projectName="${projectName}" WHERE matchID="${matchID}"`
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
        })
    }
})

router.post('/deletePlayer', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let {
        id,
        matchID,
        token
    } = {
        id: req.id,
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
                    let query = `DELETE FROM Project WHERE id="${id}"`
                    try {
                        let result = await db.delete(query)
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
        })
    }
})

module.exports = router.routes();
