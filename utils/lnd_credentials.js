const {readFile} = require('fs');
const fs = {getFile: readFile};
const {join} = require('path');
const {parse} = JSON;
const home = "credentials";
const credentials = "credentials.json"

const node = process.env.NODE

function getNode() {
    return new Promise((resolve, reject) => {
        const path = join(...[home, node, credentials]);

        console.log(path);
        fs.getFile(path, (err, res) => {
            if(err) {
                reject("cannot read " +  path)
            }
            else
            {
                const config = parse(res.toString());
                resolve(config)
            }
            
        })
        
    });
}

module.exports = {
    getNode,
}