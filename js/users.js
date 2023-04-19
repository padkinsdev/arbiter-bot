let memberInfo = {};

exports.updateLatestMessage = (message) => {
    memberInfo[message.author.id]["latestMsg"][message.guildId] = message.content;
};

exports.getMemberLastMessage = (userId, guild) => {
    return memberInfo[userId]["latestMsg"][guild];
};

exports.incrementTimeoutCount = (userId, guildId) => {
    memberInfo[userId]["timeoutCount"][guildId] += 1;
}

exports.getTimeoutCount = (userId, guildId) => {
    return memberInfo[userId]["timeoutCount"][guildId];
}