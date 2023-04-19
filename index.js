const discord = require('discord.js');
const logging = require('./js/logging');
const setup = require('./js/setup');
const checkSpam = require('./js/check-spam');
const config = require('./config.json');
const users = require('./js/users');
const responses = require('./js/responses');

// invite link: https://discord.com/api/oauth2/authorize?client_id=566418342810877973&permissions=8&scope=bot

const client = new discord.Client({
    intents: [discord.IntentsBitField.Flags.DirectMessages, 
        discord.IntentsBitField.Flags.GuildMembers, 
        discord.IntentsBitField.Flags.GuildMessages, 
        discord.IntentsBitField.Flags.MessageContent, 
        discord.IntentsBitField.Flags.GuildInvites, 
        discord.IntentsBitField.Flags.GuildModeration,
        discord.IntentsBitField.Flags.GuildMessageReactions,
        discord.IntentsBitField.Flags.GuildPresences,
        discord.IntentsBitField.Flags.Guilds],
    presence: {
        status: "online",
        activities: [{
            type: discord.ActivityType.Watching,
            name: "Kate slack off",
            url: "https://bitterblossom.xyz/"
        }]
    }
});

client.on('ready', () => {
    logging.info("Client is logged in");
});

client.on('messageCreate', (msg) => {
    checkSpam.checkMessageIsSpam(msg)
    .then((isSpam) => {
        if (isSpam) {
            logging.info(`Spam detected from user ${msg.author.username} (id: ${msg.author.id})`);
            if (!msg.author.dmChannel) {
                msg.author.createDM().then((dmChannel) => {
                    dmChannel.send(`Your most recent message in ${msg.guild.name} was flagged as spam, and you are being timed out as a result. If you feel that this judgement was incorrect, please inform your server admin(s)`)
                });
            } else {
                msg.member.dmChannel.send(`Your most recent message in ${msg.guild.name} was flagged as spam, and you are being timed out as a result. If you feel that this judgement was incorrect, please inform your server admin(s)`);
            }
            msg.member.timeout(config["spamTimeout"], "Spam detected")
            .then((member) => {
                users.incrementTimeoutCount(member.id, member.guild.id);
                logging.info(`Timed out member ${member.displayName} for ${config["spamTimeout"]/60000} minutes`);
            })
            .catch((err) => {
                logging.error(`Failed to time out user ${msg.member.displayName}: ${err}`);
            });
        }
    })
    .then(() => {
        responses.reactPrideFlag(msg);
    })
    .catch((err) => {
        logging.error(`Error while acting on messageCreate event: ${err}`);
    });
});

client.on('guildMemberAdd', (member) => {
    logging.info(`New member added to guild ${member.guild.name}: ${member.displayName}`);
    if (config["announceMemberJoinLeave"] && config["memberArrivalChannels"][member.guild.id]) {
        member.guild.channels.fetch(config["memberArrivalChannels"][member.guild.id]).then((channel) => {
            channel.send({
                "embed": new discord.EmbedBuilder().setTitle(`Welcome, ${member.displayName}!`).setThumbnail(member.avatarURL).setColor(config["embedColor"])
            });
        })
        .catch((err) => {
            logging.error(`Error while attempting to send embed for member ${member.displayName} join: ${err}`);
        });
    }
});

client.on('guildMemberRemove', (member) => {
    logging.info(`Member removed from guild ${member.guild.name}: ${member.displayName}`);
    if (config["announceMemberJoinLeave"] && config["memberArrivalChannels"][member.guild.id]) {
        member.guild.channels.fetch(config["memberArrivalChannels"][member.guild.id]).then((channel) => {
            channel.send({
                "embed": new discord.EmbedBuilder().setTitle(`Goodbye, ${member.displayName}!`).setThumbnail(member.avatarURL).setColor(config["embedColor"])
            });
        })
        .catch((err) => {
            logging.error(`Error while attempting to send embed for member ${member.displayName} removal: ${err}`);
        });
    }
});

client.on('inviteCreate', (invite) => {
    logging.info(`New invite created by user ${invite.inviter.username} (id: ${invite.inviterId}) to channel ${invite.channel.name} (id: ${invite.channelId}) in guild ${invite.guild.name} (id: ${invite.guild.id}) with ${invite.maxUses} maximum uses, expiring at ${invite.expiresTimestamp}`);
});

client.on("guildBanAdd", (ban) => {
    logging.info(`User ${ban.user.username} was banned from ${ban.guild.id} with reason ${ban.reason ? ban.reason : "<None>"}`);
});

client.on("guildBanRemove", (ban) => {
    logging.info(`User ${ban.user.username} was unbanned from ${ban.guild.id} with reason ${ban.reason ? ban.reason : "<None>"}`);
});

client.on("channelCreate", (channel) => {
    logging.info(`Channel ${channel.name} was created in guild ${channel.guild.name} (id: ${channel.guildId})`);
});

client.on("channelDelete", (channel) => {
    if (channel.type == discord.ChannelType.DM) {
        logging.info(`DM channel ${channel.guildId} with user ${channel.recipient.username} was deleted`);
    } else {
        logging.info(`Channel ${channel.name} was deleted from guild ${channel.guild.name} (id: ${channel.guildId})`);
    }
});

setup.setup().then(() => {client.login(config["token"])}).catch((err) => logging.fatal(`Error while attempting to set up and log in: ${err}`));
