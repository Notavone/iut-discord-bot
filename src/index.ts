import {CustomClient, getFiles} from "./utils";
import {Intents} from "discord.js";
import * as path from "path";
import {config} from "dotenv";
config();

const client = new CustomClient({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]});

let eventFiles = getFiles(path.join(__dirname, "events")) ?? [];
for (const eventFile of eventFiles) {
    let matches = eventFile.match(/([^\\\/:*?"<>|\r\n]+)\.\w*$/) ?? [];
    let eventName = matches[1];
    if (!eventName) continue;
    client.on(eventName, (...args: any) => require(eventFile)(client, ...args));
}

client.login(process.env.TOKEN).then(() => console.log(""));
