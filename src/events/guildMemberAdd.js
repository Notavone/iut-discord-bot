const {MessageAttachment} = require("discord.js");
const {memberCanvas} = require("../utils");
module.exports = async (client, member) => {
    let guild = client.guilds.cache.get("355396372809121792");
    if(member.guild === guild) {
        let channel = guild.channels.cache.get("638864030299193344");
        let canvas = await memberCanvas(member);
        await channel.send({files: [new MessageAttachment(canvas.toBuffer(), "cccv.png")]});
    }
};
