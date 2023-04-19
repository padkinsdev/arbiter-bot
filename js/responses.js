const logging = require('./logging');
const config = require('../config.json');

exports.reactPrideFlag = (message) => {
    return new Promise((res) => {
        if (!config["autoReply"]) {
            res();
        }
        config["autoReplies"].forEach((value) => {
            if (message.content.match(new RegExp(value["target"]))) {
                if (value["type"] == "react") {
                    message.react(value["reply"]).catch((err) => {
                        logging.error(`Error while attempting to react to ${value["target"]} with emoji ${value["reply"]}: ${err}`);
                    });
                } else if (value["type"] == "reply") {
                    message.reply(value["reply"]).catch((err) => {
                        logging.error(`Error while attempting to reply to ${value["target"]} with text ${value["reply"]}: ${err}`);
                    });
                }
            }
        });
        res();
    });
}