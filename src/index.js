require("dotenv").config();
const Discord = require("discord.js");
const path = require("path");
const {getFiles} = require("./utils");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS]});

let eventFiles = getFiles(path.join(__dirname, "./events"));
for (const eventFile of eventFiles) {
    let matches = eventFile.match(/([^\\\/:*?"<>|\r\n]+)\.\w*$/) ?? [];
    let eventName = matches[1];
    if(!eventName) continue;
    client.on(eventName, (...args) => require(eventFile)(client, ...args));
}

client.login(process.env.TOKEN).then(() => console.log(""));
