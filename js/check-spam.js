const users = require('./users');
const logging = require('./logging');
const config = require('../config.json');

exports.checkMessageIsSpam = (message) => {
    return new Promise((res) => {
        const linkRe = /https?:\/\/.+/
        //const discordLinkRe = /https?:\/\/discord\.com/

        if (!message.member.moderatable || !config["filterSpam"]) {
            res(false);
        }

        let lastMessage = users.getMemberLastMessage(message.author.id, message.guildId);
        if (lastMessage == undefined) {
            logging.error(`No previous message logged for user ${message.author.username}`);
            res(false);
        }
        if (message.content === lastMessage) {
            // if the current message is identical to the last message that the user sent, it's pretty safe to assume that it's spam
            res(true);
        }
        let links = [...message.content.matchAll(linkRe)];
        //let discordLinks = [...message.content.matchAll(discordLinkRe)]
        if (links.length > 3/* || discordLinks.length > 0*/) {
            message.channel.send(`Hi ${message.author}. That's a lot of links for one message, and I'm wondering if this is spam`)
        }
    });
}