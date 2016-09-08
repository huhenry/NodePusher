/**
 * Created by Henry on 2016-09-07.
 */

var mysql = require("mysql");


/* Creating POOL MySQL connection.*/

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'haizi112358',
    database: 'messagepusher',
    debug: true
});

var Message = function (from, to, message, sendDate, receiveDate) {
    this.messageId = 0;
    this.from = from;
    this.to = to;
    this.message = message;
    this.sendDate = sendDate;
    this.receiveDate = receiveDate;
};


Message.prototype.SaveMessage = function (from, to, message, sendDate, receiveDate, callback) {
    var self = this;
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection) {
                connection.release();
            }
            return callback(true, null);
        } else {
            var sqlQuery = "INSERT into ?? (??,??,??,??,??) VALUES (?,?,?,?,?)";
            var inserts = ["Messages", "from", "to", "message", "sendDate", "receiveDate", from, to, message, sendDate, receiveDate];
            sqlQuery = mysql.format(sqlQuery, inserts);
            connection.query(sqlQuery, function (err, rows) {
                connection.release();
                if (err) {
                    return callback(true, null);
                } else {
                    callback(false, "comment added");
                }
            });
        }
        connection.on('error', function (err) {
            return callback(true, null);
        });
    });
}

Message.prototype.ReadMessage = function (receiveEmail, callback) {
    var self = this;
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection) {
                connection.release();
            }
            return callback(true, null);
        } else {
            var sqlQuery = "select ??,??,??,??,??,?? from ?? where ?? = ? and ?? is null";
            var inserts = ["messageId", "from", "to", "message", "sendDate", "receiveDate", "Messages", "to", receiveEmail, "receiveDate"];
            sqlQuery = mysql.format(sqlQuery, inserts);
            connection.query(sqlQuery, function (err, rows) {
                connection.release();
                if (err) {
                    return callback(true, null);
                } else {
                    callback(false, rows);
                }
            });
        }
        connection.on('error', function (err) {
            return callback(true, null);
        });
    });
}

Message.prototype.ReceiveMessage = function (messageId, receiveDate, callback) {
    var self = this;
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection) {
                connection.release();
            }
            return callback(true, null);
        } else {
            var sqlQuery = "update ?? set ??=? where ?? = ? ";
            var inserts = ["Messages", "receiveDate", receiveDate, "messageId", messageId];
            sqlQuery = mysql.format(sqlQuery, inserts);
            connection.query(sqlQuery, function (err, rows) {
                connection.release();
                if (err) {
                    return callback(true, null);
                } else {
                    callback(false, null);
                }
            });
        }
        connection.on('error', function (err) {
            return callback(true, null);
        });
    });
}
exports.Message = new Message();
exports.MysqlPool = pool;
/*
 module.exports = {
 Message    :      Message,
 MySqlPool  :      pool
 }
 */
