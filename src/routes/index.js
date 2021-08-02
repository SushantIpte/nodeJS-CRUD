var config = require('../config/config');
var fs = require('fs-extra');
var path = require('path');
const { getRoutes } = require('get-routes');

var files = [];

let _fArray = fs.readdirSync(__dirname);
_fArray.splice(_fArray.indexOf('index.js'), 1);
_fArray.forEach((_fName, _i) => {
  files[_i] = require('./' + _fName);
});

module.exports = (app) => {
  files.forEach((_file) => {
    _file(app);
  });
  app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
  });


  app.use("/", (req, res) => {
    console.log('Started');
    res.sendFile(path.resolve("./src/views/index.html"));
  });

  console.log(getRoutes(app));
}