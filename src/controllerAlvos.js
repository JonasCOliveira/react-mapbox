const path = require("path");
const fs = require("fs");

const basePathToData = path.join(__dirname, "./models/alvos");

// Pega todos os dados do arquivo
const getJsonData = function (basePathToData, filename) {
  var filename = path.join(basePathToData, filename);
  return JSON.parse(fs.readFileSync(filename, "utf-8"));
};

let content = { type: "FeatureCollection", features: [] };
let actions;

var getData = (fileName) =>
  new Promise((resolve) => {
    var jsonData = require(path.join(basePathToData, fileName));
    resolve(jsonData);
  });

exports.listaAlvos = function (req, res) {
  const r = [];

  var files = new Promise((resolve) =>
    fs.readdir(basePathToData, function (err, jsonFiles) {
      resolve(jsonFiles);
    })
  );
  files.then((f) => {
    actions = f.map(getData);

    Promise.all(actions).then((response) => {
      response.forEach((element) => {
        try {
          console.log(element.features[0].properties.nome.split(" - "));
          var empresa = element.features[0].properties.nome.split(" - ")[0];
          if (!r.includes(empresa)) {
            r.push(empresa);
          }
        } catch (_) {
          console.log("error:", element.features[0]);
        }
      });
      return res.send(r);
    });
  });
};

exports.getAlvos = function (req, res) {
  var files = new Promise((resolve) =>
    fs.readdir(basePathToData, function (err, jsonFiles) {
      resolve(jsonFiles);
    })
  );
  files.then((f) => {
    actions = f.map(getData);

    Promise.all(actions).then((response) => {
      content.features = [];
      response.forEach((element) => {
        content.features.push(element.features[0]);
      });
      return res.send(content);
    });
  });
};
