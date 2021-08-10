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
                res[0].matchOptions = JSON.parse(res[0].matchOptions)
                return ctx.send(res)

            } catch (e) {
                return ctx.sendError('101', e)
            }
        })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })

    }
})

router.post('/getMyProject', async (ctx) => {
    let req = ctx.request.body
    let {
        token
    } = {
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
                let userID = result[0].id
                try {
                    let query4 = `select projectID from MatchData where userID="${userID}"`
                    let result2 = await db.find(query4)
                    let tempArr = []
                    result2.forEach(function (item) {
                        tempArr.push(item.projectID)
                    })
                    Array.prototype.method1 = function () {
                        var arr = [];    //定义一个临时数组
                        for (var i = 0; i < this.length; i++) {    //循环遍历当前数组
                            //判断当前数组下标为i的元素是否已经保存到临时数组
                            //如果已保存，则跳过，否则将此元素保存到临时数组中
                            if (arr.indexOf(this[i]) == -1) {
                                arr.push(this[i]);
                            }
                        }
                        return arr;
                    }
                    let Arr = tempArr.method1()
                    let resArr
                    let tempArr2 = []
                    for (const item of Arr) {
                        let query = `select matchID from Project where id=${item}`
                        let tempRes = await db.find(query)
                        tempArr2.push(tempRes[0].matchID)
                    }
                    resArr = tempArr2.method1()
                    console.log(resArr)
                    let resArr2 = []
                    for (const item of resArr) {
                        let query = `select * from MatchInfo where id=${item}`
                        let tempRes = await db.find(query)
                        tempRes[0].matchOptions = JSON.parse(tempRes[0].matchOptions)
                        console.log(tempRes)
                        resArr2.push(tempRes[0])
                    }
                    return ctx.send(resArr2)
                } catch (e) {
                    console.log(e)
                    return ctx.sendError('101', e.message)
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(async err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
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
    console.log(code)
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
                let newObj = {}
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

router.post('/checkProject', async (ctx) => {
    let req = ctx.request.body;
    let {
        code,
        token
    } = {
        code: req.code,
        token: req.token
    }
    console.log(code)
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let query2 = `SELECT * FROM MatchInfo WHERE code = "${code}"`
            try {
                let result = await db.find(query2)
                console.log(result.length)
                if (result.length === 0) {
                    return ctx.sendError('101', '该比赛不存在！')
                } else {
                    if (new Date() - new Date(result[0].startTime) >= 0) {
                        return ctx.send('true')
                    } else {
                        return ctx.sendError('101', '该比赛未开始！')
                    }
                }
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

router.post('/canICheckProject', async (ctx) => {
    let req = ctx.request.body;
    let {
        code,
        token
    } = {
        code: req.code,
        token: req.token
    }
    console.log(code)
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let query2 = `SELECT * FROM MatchInfo WHERE code = "${code}"`
            try {
                let result1 = await db.find(query2)
                // console.log(JSON.parse(result1[0].matchOptions))
                let isReadRank = JSON.parse(result1[0].matchOptions).readRank
                let creatorID = result1[0].creatorID
                // console.log(isReadRank,creatorID)
                if (isReadRank) {
                    ctx.send(true)
                } else {
                    if (creatorID !== result[0].id) {
                        ctx.send(false)
                    } else {
                        ctx.send(true)
                    }
                }
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
