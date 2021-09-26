import {CustomClient, memberCanvas} from "../utils";
import {GuildMember, MessageAttachment, TextChannel} from "discord.js";
module.exports = async (client: CustomClient, member: GuildMember) => {
    let guild = client.guilds.cache.get("355396372809121792");
    if(member.guild === guild) {
        let channel = <TextChannel>guild.channels.cache.get("883715091147661333");
        let canvas = await memberCanvas(member);
        if(!channel) return;
        await channel.send({content: `Bye bye <@${member.id}>!`});
        await channel.send({files: [new MessageAttachment(canvas.toBuffer(), "byebye.png")]});
    }
};
