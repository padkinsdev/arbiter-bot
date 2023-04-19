![Arbiter's Profilke Picture](./assets/pfp.png)
# arbiter-bot, aka Arbiter
Arbiter is a Discord bot. That's about all there is to it. Instead of sharing some of my more interesting personal projects, I'm sharing my first attempt at creating a Discord bot since [Scholars](https://github.com/padkinsdev/scholars-bot). Bear in mind that much of this code is written in the early hours of morning after getting home from work, so the code quality is...questionable. The profile picture is a Picrew that I generated in 2020, but unfortunately I don't have the name of the artist who created the Picrew.

## Config
Arbiter bases a great deal of its behavior on the content of a [config.json](./config.json) file in the root directory. I will do my best to keep the sample config file up to date so that any interested individuals can easily configure the bot for their own use.

## Permissions
The invite link that I use for Arbiter uses a permission value of 8, meaning that Arbiter has Administrator access in any server I invite it to. Additionally, Arbiter subscribes to a number of privileged intents which can be viewed in the [index.js](./index.js) file of this repository. I include error handling in the bot design, but be aware that inviting your own instance of the bot with a custom permission integer may result in some uncaught exceptions. If you don't like this, you can add your own error handling or be lazy and create a handler for the process `uncaughtException` and `unhandledRejection` events, but I would strongly recommend against doing this unless you know what you're doing.