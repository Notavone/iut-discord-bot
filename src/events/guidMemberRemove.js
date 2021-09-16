const {MessageAttachment} = require("discord.js");
const {memberCanvas} = require("../utils");
module.exports = async (client, member) => {
    let guild = client.guilds.cache.get("355396372809121792");
    if(member.guild === guild) {
        let channel = guild.channels.cache.get("883715091147661333");
        let canvas = await memberCanvas(member);
        await channel.send({content: `Bye bye <@${member.id}>!`});
        await channel.send({files: [new MessageAttachment(canvas.toBuffer(), "byebye.png")]});
    }
};
