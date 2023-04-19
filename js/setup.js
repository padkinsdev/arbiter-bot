const config = require('../config.json');
const fs = require('fs');

exports.setup = () => {
    return new Promise((res, rej) => {
        fs.access(`${process.cwd()}${config.logDir}`, (err) => {
            if (err) {
                fs.mkdir(`${process.cwd()}${config.logDir}`, (err) => {
                    if (err) {
                        rej(err);
                    }
                    res();
                });
            }
            res();
        });
    });
}