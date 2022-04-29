const express = require("express");
const app = express();

const allowCors = require("./config/cors");

var path = require("path");

app.use(express.static(path.join(__dirname, "build")));
app.use(allowCors.cors);

var alvosController = require("./controllerAlvos");
var descargasController = require("./controllerDescargas");
var radaresController = require("./controllerREDEMET");
var goesController = require("./controllerGOES");

// URLs base
app.get("/api/lista-alvos", alvosController.listaAlvos);
app.get("/api/alvos", alvosController.getAlvos);

app.get("/api/descargas", descargasController.getDescargas);

app.get("/api/radares", radaresController.getRadares);

app.get("/api/goes", goesController.getGOES);

// Filtros
// app.get("/api/alvo/:nome", dataController.getAlvo);

const port = 3002;

const server = app.listen(process.env.PORT || port, () => {
  var port = server.address().port;
  console.log("App listening on port:", port);
});
