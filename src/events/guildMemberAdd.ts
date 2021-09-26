import {CustomClient, memberCanvas} from "../utils";
import {GuildMember, MessageAttachment, TextChannel} from "discord.js";
module.exports = async (client: CustomClient, member: GuildMember) => {
    let guild = client.guilds.cache.get("355396372809121792");
    if(member.guild === guild) {
        let channel = <TextChannel>guild.channels.cache.get("638864030299193344");
        let canvas = await memberCanvas(member);
        if(!channel) return;
        await channel.send({files: [new MessageAttachment(canvas.toBuffer(), "cccv.png")]});
    }
};
