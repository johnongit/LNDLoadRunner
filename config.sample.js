require("dotenv").config();

const config = {
  dest_key: process.env.DEST_KEY,
  nb_test: process.env.NB_TEST,
  lnd_enpoint: "172.18.0.2:10009", //grpc interface
  cert: 'base64 cert', // eg. base64 ~/.lnd/tls.cert | tr -d '\n'
  admin_macaroon: 'base64 macaroon' // eg. base64 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon | tr -d '\n'
};


module.exports = {
    config,
};