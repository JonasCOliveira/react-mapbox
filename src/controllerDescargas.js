const path = require("path");
const fs = require("fs");

const basePathToData = path.join(__dirname, "./models/descargas");

let content = {};
let actions;

var getData = (fileName) =>
  new Promise((resolve) => {
    var jsonData = require(path.join(basePathToData, fileName));
    resolve(jsonData);
  });

exports.getDescargas = function (req, res) {
  getData("goes.json").then((data) => {
    return res.send(data);
  });

  //   var files = new Promise((resolve) =>
  //     fs.readdir(basePathToData, function (err, jsonFiles) {
  //       resolve(jsonFiles);
  //     })
  //   );
  //   files.then((f) => {
  //     actions = f.map(getData);

  //     Promise.all(actions).then((response) => {
  //       return res.send(response);
  //     });
  //   });
};
