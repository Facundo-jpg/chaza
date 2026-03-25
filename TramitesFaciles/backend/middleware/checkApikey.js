require("dotenv").config();

const checkApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ messagge: "API key invalida o faltante" });
  }
};

module.exports = checkApiKey;
