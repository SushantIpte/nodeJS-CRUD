var model = require('../models/apiModel')

module.exports = (app) => {

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
    let data = {
      First: req.body.First,
      Last: req.body.Last,
      Email: req.body.Email,
      Contact: req.body.Contact
    }
    if (img) {
      data.Profile = str
    }
    model.update(id, data)
      .then((_result) => {
        res.status(200).send(_result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  app.delete("/api/delete", (req, res) => {
    model.getData(req.body.prodid)
      .then((result) => {
        if (result && result[0] && result[0].profile) {
          fs.remove(result[0].profile, function (err, res) {
            if (err) {
              console.info(err);
            }
          })
        }
        model.delete(req.body.prodid)
          .then((result) => {
            res.status(200).send(_result);
            console.log("Deleted");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  app.get("/api/get", (req, res) => {
    model.getData()
      .then((_result) => {
        res.status(200).send(_result);
      })
      .catch((err) => {
        console.log(err, 'err')
        res.status(400).send(err);
      })

  });
}