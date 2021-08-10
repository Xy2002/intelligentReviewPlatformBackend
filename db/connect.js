const mysql = require('mysql')

let pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'Xy020614@',
    database: 'miniprogram',
    timezone: 'Asia/Shanghai'
})

let db = {};

pool.on('connection',function (connection) {
    console.log(connection)
})


pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

//SELECT * FROM t_user WHERE username = "whg"
db.find = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results, fields) => {
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
        pool.query(query, values, (err, results) => {
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
        pool.query(query, (err, results) => {
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
        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        })
    })
}


module.exports = db;
