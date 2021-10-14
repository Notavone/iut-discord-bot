import {CustomClient} from "../utils";
import {CommandInteraction, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export async function execute(client: CustomClient, interaction: CommandInteraction) {
    let requester = interaction.user ?? client.user!;
    let user = interaction.options.get("bogareur")?.user ?? client.user!;
    let url = "https://c.tenor.com/LY16dBOyg9IAAAAC/spongebob-squarepants-fight-me.gif";
    if (requester === user) url = "https://c.tenor.com/rVITf4xkgrkAAAAS/steve-carell-no.gif";
    let embed = new MessageEmbed().setImage(url);
    await interaction.editReply({content: `<@${user.id}>, tu es défié par <@${requester.id}>`, embeds: [embed]})
}

export const slash = {
    data: new SlashCommandBuilder()
        .setName("bogar")
        .setDescription("Octogone")
        .addUserOption((o) => o
            .setName("bogareur")
            .setDescription("Dit moi qui tu veux boxer")
            .setRequired(true)
        )
}
