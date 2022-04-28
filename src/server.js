const express = require("express");
const app = express();

const allowCors = require("./config/cors");

var path = require("path");

app.use(express.static(path.join(__dirname, "build")));
app.use(allowCors.cors);

var dataController = require("./controller");
var descargasController = require("./controllerDescargas");
var radaresController = require("./controllerREDEMET");

// URLs base
app.get("/api/lista-alvos", dataController.listaAlvos);
app.get("/api/alvos", dataController.getAlvos);

app.get("/api/descargas", descargasController.getDescargas);

app.get("/api/radares", radaresController.getRadares);

// Filtros
// app.get("/api/alvo/:nome", dataController.getAlvo);

const port = 3002;

const server = app.listen(process.env.PORT || port, () => {
  var port = server.address().port;
  console.log("App listening on port:", port);
});
