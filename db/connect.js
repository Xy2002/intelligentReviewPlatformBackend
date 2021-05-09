const mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Xy020614@',
    database: 'miniprogram'
})

let db = {};

connection.connect(function (err) {
    if (err) {
        console.error('连接失败: ' + err.stack);
        return;
    }

    console.log('连接成功 id ' + connection.threadId);
});

connection.on("error", function (err) {
    console.log("db error", err);
    // 如果是连接断开，自动重新连接
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        connection.connect(function (err) {
            if (err) {
                console.error('连接失败: ' + err.stack);
                return;
            }
            console.log('连接成功 id ' + connection.threadId);
        });
    } else {
        throw err;
    }
});

//SELECT * FROM t_user WHERE username = "whg"
db.find = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results, fields) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

//'INSERT INTO t_user(username, pass) VALUES(?, ?)'
//["lalla","bbbb"]
db.insert = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

//'DELETE FROM t_user  WHERE id = 1'
db.delete = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

//UPDATE t_user SET pass = "321" WHERE username = "whg"
db.update = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}


module.exports = db;
