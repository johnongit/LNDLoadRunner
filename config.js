require("dotenv").config();

const config = {
  dest_key: process.env.DEST_KEY,
  nb_test: process.env.NB_TEST,
  node: process.env.NODE,
};


module.exports = {
    config,
};