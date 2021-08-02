const amqp = require('amqplib/callback_api');
const q = 'firstQueue';

let connection;

function ExecQuery(query, res) {
  // console.log(query,'query')

  var promise = new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    // connection = amqp.connect('amqp://localhost', function (err, conn) {
    //   if (err) reject(err)
    //   else {
    //     conn.createChannel(function (err, ch) {
    //       if (err) reject(err)
    //       else {
    //         ch.assertQueue(q)
    //         resolve(ch.sendToQueue(q, Buffer.from(query)))
    //       }
    //     })
    //   }
    // });
  });
  return promise;
}

module.exports = {
  getCon: (connection) => {
    con = connection;
  },
  insert: (_obj) => {
    let query;
    query = 'INSERT INTO `clientData` (`First`, `Last`, `Email`, `Contact`, `Profile`) VALUES ("' + _obj.first + '","' + _obj.last + '","' + _obj.email + '","' + _obj.contact + '","' + _obj.profile + '")'
    return ExecQuery(query);
  },

  update: (_id, _obj) => {
    let query = 'UPDATE `clientData` SET '
    Object.keys(_obj).forEach((_val) => {
      query += _val + ' = "' + _obj[_val] + '",';
    })
    query = query.substr(0, query.length - 1);
    query += ' WHERE Id = ' + _id;
    return ExecQuery(query);
  },

  delete: (_id) => {
    let query = 'DELETE FROM `clientData` WHERE Id = ' + _id;
    return ExecQuery(query);
  },

  getData: (_id) => {
    let query = 'SELECT * FROM `clientData`';
    if (_id !== undefined) {
      query += 'WHERE Id = ' + _id;
    }
    return ExecQuery(query);
  }
}