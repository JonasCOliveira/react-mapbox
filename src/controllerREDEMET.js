const axios = require("axios");

exports.getRadares = async function (req, res) {
  let response = await axios
    .get(
      "https://api-redemet.decea.mil.br/produtos/satelite/realcada?api_key=qSxpX00zVJZW4eGf35aMNlthpee5ROuPFiJsDiwg&data=2020032114",
      {}
    )

  return res.json(response.data);
};
