const config = require("../config.json");
const fs = require("fs");

function writeLog(level, message) {
    let now = new Date();
    let logPath = `${process.cwd()}${config["logDir"]}logfile-${now.getDate()}-${now.getMonth()}-${now.getFullYear()}.log`;
    fs.appendFile(logPath, `${level}: ${message}\n`, (err) => {
        if (err) {
            console.error(`Failed to write to log at ${logPath}: ${err}`);
        }
    });
}

exports.trace = (message) => {
    writeLog("TRACE", message);
}

exports.debug = (message) => {
    writeLog("DEBUG", message);
}

exports.info = (message) => {
    writeLog("INFO", message);
}

exports.warn = (message) => {
    writeLog("WARN", message);
}

exports.error = (message) => {
    writeLog("ERROR", message);
}

exports.fatal = (message) => {
    writeLog("FATAL", message);
}
