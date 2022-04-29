const path = require("path");

const basePathToData = path.join(__dirname, "./models/goes/");

exports.getGOES = function (req, res) {
  return res.sendFile(path.join(basePathToData, "1.png"));
};
