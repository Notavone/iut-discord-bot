module.exports = async (client, interaction) => {
    if (!interaction.isCommand) return;

    let command = client.commands.get(interaction.commandName);
    if (!command) return;

    let member = interaction?.member;
    if (!member) return interaction.reply({content: "t ki"});

    if (command.slash.permissionFlags && !command.slash.permissionFlags.every(perm => member.permissions.has(perm))) {
        return interaction.reply({content: "missing permissions"});
    }

    try {
        await interaction.deferReply({ephemeral: command.slash.ephemeral});
        await command(client, interaction);
    } catch (e) {
        return console.log(e);
    }
};
