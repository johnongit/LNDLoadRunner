# LNDLoadRunner


LNDLoadRunner is a simple keysend payment load runner for LND.

This simple script attempt as many keysend payment as it can (according NB_TEST environment variable)

# Configure

Copy config.sample.js to config.js
Edit config.js:
* lnd_enpoint: GRPC endpoint of the source node
* cert: base64 encoded certificate of the source node
* admin_macaroon: base64 encoded macaroon of the source node

# Install (npm only)

> npm install

# build (docker only)

> docker build -t lndloadrunner .

(Must be rebuilded after each modification of config.js)

# Run

* npm

> DEST_KEY=<destination public key node> NB_TEST="number of concurrent payment" node index.js


* docker

> docker run -e DEST_KEY=<destination public key node> -e NB_TEST="number of concurrent payment" --rm  lndloadrunner node index.js