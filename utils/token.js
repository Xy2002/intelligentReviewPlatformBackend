const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
const privateKey = fs.readFileSync('./pem/private.key')
const publicKey = fs.readFileSync('./pem/public.key')

function generateToken(openId) {
    let payload = {name: openId}
    if (openId) {
        const tokenRS256 = jwt.sign(payload, privateKey, {expiresIn: '7 days', algorithm: 'RS256'})
        return tokenRS256
    } else {
        throw new Error("openId is null")
    }
}

function verifyToken(token){
    jwt.verify(token, publicKey, (error, decoded) => {
        if (error) {
            throw new Error(error.message)
        }
        return decoded
    })
}

module.exports = {generateToken,verifyToken}
