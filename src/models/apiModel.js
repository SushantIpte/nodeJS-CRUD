let con;

function ExecQuery(query, res) {
  var promise = new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
  });
  return promise;
}

module.exports = {
  getCon: (connection) => {
    con = connection;
  },
  insert: (_obj) => {
    let query;
    // if (_obj.profile) {
    query = 'INSERT INTO `clientData` (`First`, `Last`, `Email`, `Contact`, `Profile`) VALUES ("' + _obj.first + '","' + _obj.last + '","' + _obj.email + '","' + _obj.contact + '","' + _obj.profile + '")'
    // } else {
    //   query = 'INSERT INTO `clientData` (`First`, `Last`, `Email`, `Contact`) VALUES ("' + _obj.first + '","' + _obj.last + '","' + _obj.email + '","' + _obj.contact + '")';
    // }
    return ExecQuery(query);
  },

  getData: () => {
    let query = 'SELECT * FROM `clientData`';
    return ExecQuery(query);
  }
}