import {Command, CustomClient} from "../utils";
import {Guild} from "discord.js";

module.exports = async (client: CustomClient, guild: Guild) => {
    await guild.commands.set(client.commands.map((cmd: Command) => cmd.slash.data));
};
