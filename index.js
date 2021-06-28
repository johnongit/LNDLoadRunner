const lnService = require('ln-service');
const logger = require("./utils/logger.js");
const lnd_credentials = require("./utils/lnd_credentials");
const {randomBytes} = require('crypto');
const {createHash} = require('crypto');
const {config} = require("./config.js");




function sendPayment(lnd,node) {

    const keySendPreimageType = '5482373484';
    const preimageByteLength = 32;
    const preimage = randomBytes(preimageByteLength);
    const id = createHash('sha256').update(preimage).digest().toString('hex');
    const secret = preimage.toString('hex');
    const destination = node;
    return new Promise(function(resolve, reject) {
        lnService.payViaPaymentDetails({
            id,
            destination: destination,
            lnd: lnd,
            messages: [{type: keySendPreimageType, value: secret}],
            tokens: 1,
        })
        .then(res => {
            resolve(true)
        })
        .catch(err => {
            console.log("error", err)
            resolve(false)
        })
    })
}


 async function runTest(lnd, node) {


    let success = 0
    let error = 0
    let nbTest = config.nb_test
    const startTime = new Date();
    var promise = new Promise(function(resolve, reject) {
        let test = 0
        for(i=0; i<=nbTest; i++) {
            const payment = sendPayment(lnd, node)
            payment.then((res)=> {
                test++
                if(res)
                {
                    success++
                }
                if(test==nbTest)
                {
                    resolve(success)
                }
            })
        }
    })
    promise.then((res) => {
        const endTime = new Date();
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff);
        let tps = Math.round(res/timeDiff);
        logger.info("=======================================")
        logger.info("Node: " + node)
        logger.info("Nombre de payments " + res + " en : " + seconds + " secondes")
        logger.info("TPS: " + tps)
    })
}

main()
async function main() {
    try {
        const credentials = await lnd_credentials.getNode()

        const {lnd} = await lnService.authenticatedLndGrpc({
          cert: credentials.cert,
          macaroon: credentials.admin_macaroon,
          socket: credentials.lnd_enpoint,
        });
        lnService.getIdentity({lnd})
        .then(async function (res) {
            logger.info("Source Node: " + res.public_key)
            let node_list = config.dest_key.split(' ');
            node_list.forEach(node => {
                runTest(lnd, node)  
            });
            //await runTest(lnd)  
        })
        .catch((err) => {
            logger.info("Cannot get pubkey " + err)
        })
    }
    catch(err) {
        console.log(err)
    }

}



