var model = require('../models/apiModel')

module.exports = (app, con) => {
  model.getCon(con);

  app.post("/api/save", (req, res) => {
    var dt = new Date();
    var _obj = {
      first: req.body.First,
      last: req.body.Last,
      email: req.body.Email,
      contact: req.body.Contact,
      profile: 'NULL',
    };
    if (req.files && req.files.profile) {
      var str = 'images/' + + dt.getTime() + '.' + req.files.profile.name.split('.')[1]
      _obj.profile = str;
      var sampleFile = req.files.profile;
      sampleFile.mv(str, function (err) {
        if (err)
          return res.status(500).send(err);
      });
    }
    model.insert(_obj)
      .then((_result) => {
        res.status(200).send(_result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });



  app.post("/api/edit", (req, res) => {
    var id = req.body._id
    delete req.body._id;
    var img = false
    if (req.files && req.files.profile) {
      var dt = new Date();
      var str = 'images/' + + dt.getTime() + '.' + req.files.profile.name.split('.')[1]
      var sampleFile = req.files.profile;
      sampleFile.mv(str, function (err) {
        if (err)
          return res.status(500).send(err);
      });
      console.log('saved')
      img = true;
    }
    if (img) {
      var query = 'UPDATE `clientData` SET `First` = "' + req.body.First + '", `Last` = "' + req.body.Last + '", `Email` = "' + req.body.Email + '", `Contact` = "' + req.body.Contact + '", `Profile` = "' + str + '" WHERE Id=' + id;
    } else {
      var query = 'UPDATE `clientData` SET `First` = "' + req.body.First + '", `Last` = "' + req.body.Last + '", `Email` = "' + req.body.Email + '", `Contact` = "' + req.body.Contact + '" WHERE Id=' + id;
    }
    ExecQuery(query, res)
  });

  app.delete("/api/delete", (req, res) => {
    var query = 'SELECT * FROM `clientData` WHERE Id = ' + req.body.prodid;
    con.query(query, function (err, result, fields) {
      if (result && result[0] && result[0].profile) {
        fs.remove(result[0].profile, function (err, res) {
          if (err) {
            console.info(err);
          }
        })
      }
    });

    var query = 'DELETE FROM `clientData` WHERE Id = ' + req.body.prodid;
    console.log(query)
    con.query(query, function (err, result, fields) {
      if (err)
        res.send(err);
      else
        res.json({ message: 'Successfully deleted' });
    });
    console.log("Deleted");
  });

  app.get("/api/get", (req, res) => {
    model.getData()
      .then((_result) => {
        res.status(200).send(_result);
      })
      .catch((err) => {
        res.status(400).send(err);
      })

  });
}