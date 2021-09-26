import {CustomClient} from "../utils";
import {Interaction, Permissions} from "discord.js";

module.exports = async (client: CustomClient, interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    let command = client.commands.get(interaction.commandName);
    if (!command) return;

    let member = interaction?.member;
    if (!member) return interaction.reply({content: "Pas de membre à récupérer"});

    if (command.slash.permissionFlags && !command.slash.permissionFlags.every((perm) => {
        if (!member?.permissions) return false;
        if (member.permissions instanceof Permissions) {
            return member.permissions.has(perm);
        }
        return false;
    })) {
        return interaction.reply({content: "Permissions manquantes"});
    }

    try {
        await interaction.deferReply({ephemeral: command.slash.ephemeral});
        await command.execute(client, interaction);
    } catch (e) {
        return console.log(e);
    }
};
