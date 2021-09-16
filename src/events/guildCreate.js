module.exports = async (client, guild) => {
    await guild.commands.set(client.commands.map(cmd => cmd.slash.data));
};
