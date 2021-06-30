# LNDLoadRunner


LNDLoadRunner is a simple keysend payment load runner for LND.

This simple script attempt as many keysend payment as it can (according NB_TEST environment variable)

# Configure credentials

LND credentials (TLS cert / admin macaroon) are managed like "Balance Of satoshi". 

To add a credentials:
* Create a directory into "credentials" (eg: AliceNode)
* Create credentials.json file.

Each file should have the following format
```json
{
    "lnd_enpoint": "<lnd IP>:10009",
    "cert": "base64 tls cert",
    "admin_macaroon": "base64 macaroon"
}
```

**Note:** `cert` and (admin) `macaroon` should have base64-encoded, and newline-stripped content of the files. To get the strings in appropriate format you can run, ex:

>```bash
># For `cert` 
>base64 ~/.lnd/tls.cert | tr -d '\n'
>
># For `macaroon`
>base64 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon | tr -d '\n'
>```

# Install (npm only)

> npm install

# build (docker only)

> docker build -t lndloadrunner .


# Run

## npm

> DEST_KEY="<destination1 public key node> <destination2 public key node> <destination3 public key node>" NB_TEST="number of concurrent payment" NODE=aliceNode node index.js


## docker

> docker run -v $PWD/credentials:/usr/src/app/credentials -e DEST_KEY="<destination1 public key node> <destination2 public key node> <destination3 public key node>" -e NB_TEST="number of concurrent payment" -e NODE=aliceNode --rm  lndloadrunner node index.js


# Environment variable

* DEST_KEY: destination node (can be multiple)
* NB_TEST: number of keysend
* NODE: LND credentials of the source node (map with credentials/<directory>)