const lnService = require('ln-service');
const logger = require("./utils/logger.js");
const {randomBytes} = require('crypto');
const {createHash} = require('crypto');
const {config} = require("./config.js");



const {lnd} = lnService.authenticatedLndGrpc({
  cert: config.cert,
  macaroon: config.admin_macaroon,
  socket: config.lnd_enpoint,
});

function sendPayment() {
    const keySendPreimageType = '5482373484';
    const preimageByteLength = 32;
    const preimage = randomBytes(preimageByteLength);
    const id = createHash('sha256').update(preimage).digest().toString('hex');
    const secret = preimage.toString('hex');
    const destination = config.dest_key;

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
            console.log(err)
            resolve(false)
        })
    })
}


 async function runTest() {
    let success = 0
    let error = 0
    let nbTest = config.nb_test
    const startTime = new Date();
    var promise = new Promise(function(resolve, reject) {
        let test = 0
        for(i=0; i<=nbTest; i++) {
            const payment = sendPayment()
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
        console.log(lnd)
        lnService.getIdentity({lnd})
        .then(async function (res) {
            logger.info(res.public_key)
            /*
            config.dest_key.forEach(node => {
                console.log(node)
            });
            */
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
