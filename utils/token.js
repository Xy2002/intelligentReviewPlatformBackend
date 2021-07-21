const fs = require('fs')
const jwt = require('jsonwebtoken')
const privateKey = fs.readFileSync('./pem/private.key')
const publicKey = fs.readFileSync('./pem/public.key')

function generateToken(openid,sessionKey) {
    let payload = {openid: openid,sessionKey: sessionKey}
    if (openid) {
        return jwt.sign(payload, privateKey, {expiresIn: '31 days', algorithm: 'RS256'})
    } else {
        throw new Error("openId is null")
    }
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, (error, decoded) => {
            if (error) {
                reject(error.message)
            }
            resolve(decoded)

        })
    })
}

module.exports = {generateToken,verifyToken}
