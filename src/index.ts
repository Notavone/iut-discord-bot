import {CustomClient, getFiles} from "./utils";
import {Intents} from "discord.js";
import * as path from "path";
import {config} from "dotenv";
import startup from "./startup";

config();

const client = new CustomClient({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]});

if (process.env.RUN_SCRIPT) {
    startup(client).then(() => console.log("Scripts exceptionnels exécutés, merci de redémarrer sans l'argument RUN_SCRIPT"));
}

let eventFiles = getFiles(path.join(__dirname, "events")) ?? [];
for (const eventFile of eventFiles) {
    let matches = eventFile.match(/([^\\\/:*?"<>|\r\n]+)\.\w*$/) ?? [];
    let eventName = matches[1];
    if (!eventName) continue;
    client.on(eventName, (...args: any) => require(eventFile)(client, ...args));
}

client.login(process.env.TOKEN).then(() => console.log(""));
