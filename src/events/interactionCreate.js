module.exports = async (client, interaction) => {
    if(!interaction.isCommand) return;

    let command =  client.commands.get(interaction.commandName);
    if(!command)return;

    await interaction.deferReply({ephemeral: command.slash.ephemeral});
    await command(client, interaction);
}
