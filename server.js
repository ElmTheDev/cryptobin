const express = require('express');
const aes256 = require('aes256');
const fs = require('fs');
const app = express();


const PORT = 3000;
const MASTER_KEY = 'your_encryption_key';
const PASTE_PATH = './paste_archive/pastes/'; // Path where all pastes are stored
const ALPHABET = '23456789abdegjkmnpqrvwxyz'; // Alphabet that random ID will be generated from
const ID_LENGTH = 8;


app.get('/api/newpaste', (req, res) => {
    if (!req.query.content || !req.query.key) { // Checks if key and content are provided in arguments
        let responseObject = {
            "success": false,
            "error": "You have to provide content and key in GET request."
        };
        res.send(responseObject);
        return;
    }
    let pasteContent = aes256.encrypt(req.query.key, req.query.content); // Encrypts content user submitted
    newPaste(pasteContent, function(id) {
        if (id === 'err') {
            let responseObject = {
                "success": false,
                "error": "Unknown error occurred"
            };
            res.send(responseObject);
            return;

        }

        let responseObject = {
            "success": true,
            "pasteId": id,
            "pasteKey": req.query.key
        };
        res.send(responseObject);
    });
});

app.get('/api/getpaste', (req, res) => {  // Checks if key and ID are provided in arguments
    if (!req.query.id || !req.query.key) {
        let responseObject = {
            "success": false,
            "error": "You have to provide ID and key in GET request."
        };
        res.send(responseObject);
        return;
    }

    fetchPaste(req.query.id, function(error, content) {
        if (error) {
            let responseObject = {
                "success": false,
                "error": content
            };
            res.send(responseObject);
            return;
        }

        let responseObject = {
            "success": true,
            "pasteId": req.query.id,
            "pasteKey": req.query.key,
            "pasteContent": aes256.decrypt(req.query.key, content)
        };
        res.send(responseObject)
    });

});

function newPaste(pasteContent, cb) {
    let uniqueId = generateId();
    let pathToFile = `${PASTE_PATH}${uniqueId}.ep`; // Generates path to .ep file that has encrypted paste

    fs.writeFile(pathToFile, aes256.encrypt(MASTER_KEY, pasteContent), (err) => {
        if (err) {
            cb('err');
            return;
        }
        cb(uniqueId);
    });
}

function fetchPaste(pasteId, cb) {
    let pathToFile = `${PASTE_PATH}${pasteId}.ep`; // Generates path to .ep file that has encrypted paste
    fs.readFile(pathToFile, function read(err, data) {
        if (err) {
            cb(true, 'Paste does not exist');
            return;
        }
        content = data.toString();
        content = aes256.decrypt(MASTER_KEY, content);
        cb(false, content);
    });
}

app.listen(PORT, () => {
    console.log(`CryptoBin server started on port ${PORT}`);
});


// Credits to http://fiznool.com/

const generateId = function() {
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}
