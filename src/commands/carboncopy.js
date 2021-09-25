const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions} = require("discord.js");

module.exports = async (client, interaction) => {
    let role = interaction.options.get("role")?.role;
    if (!role) return interaction.editReply({content: "wtf?"});

    let members = [...role.members.values()];
    if(members.length === 0) return interaction.editReply({content: "no members"});
    let messages = [];
    let message = "Cc :\n";
    for (let member of members) {
        let text = `<@${member.id}>`;
        if (message.length + text.length > 2000) {
            messages.push(message);
            message = "";
        }
        message += text;
    }
    messages.push(message);

    await interaction.editReply({content: "ok"});
    for (let msg of messages) {
        let message = await interaction.channel.send({content: msg});
        await message.delete();
    }
};

module.exports.slash = {
    ephemeral: true,
    permissionFlags: [Permissions.FLAGS.ADMINISTRATOR],
    data: new SlashCommandBuilder()
        .setName("carboncopy")
        .setDescription("Mentionne tout les membres d'un groupe")
        .addRoleOption(o => o
            .setName("role")
            .setDescription("Le groupe à mentionner")
            .setRequired(true)
        )
};
