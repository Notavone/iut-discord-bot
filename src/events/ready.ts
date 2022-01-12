import {CustomClient, getFiles, splitArray} from "../utils";
import {GuildMemberRoleManager, MessageActionRow, MessageButton, MessageEmbed, Role} from "discord.js";
import * as path from "path";

const GUILD_ID = "355396372809121792";
const ROLE_AN_1 = "486169138671386646";
const ROLE_AN_2 = "487185971805421579";
const AUTO_CHANNEL = "881954802249113621";

module.exports = async (client: CustomClient) => {
    console.log("Bot en ligne !");

    let guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) throw new Error("Impossible d'accéder au serveur");

    let newsABII = guild.roles.cache.get("822162045641162771");
    let bogareurs = guild.roles.cache.get("884034441121517568");
    let an1 = guild.roles.cache.get(ROLE_AN_1);
    let an2 = guild.roles.cache.get(ROLE_AN_2);
    if (!newsABII || !bogareurs || !an1 || !an2) throw new Error("Il manque des roles");

    // await createCollectorForRolesStartingWith("1ère année - S1", "S1-", an1);
    await createCollectorForRolesStartingWith({client, description: "1ère année - S2", discriminator: "S2-", assignedRole: an1});
    // await createCollectorForRolesStartingWith("2ème année - S3", "S3", an2);
    await createCollectorForRolesStartingWith({client, description: "2ème année - S4", discriminator: "S4-", assignedRole: an2});

    await autoRoles({client, description: "Roles spéciaux", roles: [newsABII, bogareurs]});

    let commandFiles = getFiles(path.join(__dirname, "../commands")) ?? [];
    for (const commandFile of commandFiles) {
        let command = require(commandFile);
        await client.commands.set(command.slash.data.name, command);
    }

    for (let guild of [...client.guilds.cache.values()]) {
        await guild.commands.set(client.commands.map(cmd => cmd.slash.data));
    }
}

async function createCollectorForRolesStartingWith(options: { client: CustomClient, description: string, discriminator: string, assignedRole: Role }) {
    let {description, discriminator, assignedRole, client} = options;
    let guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) throw new Error("Impossible de trouver le serveur");

    let channel = guild.channels.cache.get(AUTO_CHANNEL);
    let anciens = guild.roles.cache.get("486070633164439553");
    let an1 = guild.roles.cache.get(ROLE_AN_1);
    let an2 = guild.roles.cache.get(ROLE_AN_2);

    if (!channel) throw new Error("Il manque des salons");
    if (!channel.isText()) throw new Error("Le salon n'est pas un salon textuel");
    if (!anciens) throw new Error("Il manque des roles");

    let groups = guild.roles.cache.filter(r => r.name.match(/S\d-.\d/) !== null);
    let channelMessages = await channel.messages.fetch();
    let roleEmbed = channelMessages.find((m => m.embeds[0].description === description));

    if (!roleEmbed) {
        let embed = new MessageEmbed()
            .setDescription(description);
        let roles = guild.roles.cache.filter((r) => r.name.startsWith(discriminator));
        let orderedNames = roles.map((r) => r.name).sort();
        let orderedRoles = orderedNames.map((name) => roles.find((r) => r.name === name));

        let boutons = splitArray([...orderedRoles.values()], 5).map((ar: any) => {
            return new MessageActionRow().addComponents(
                ar.map((r: any) => {
                    return new MessageButton()
                        .setCustomId(r.id)
                        .setLabel(r.name)
                        .setStyle("PRIMARY");
                }));
        });
        roleEmbed = await channel.send({embeds: [embed], components: boutons});
    }

    roleEmbed.createMessageComponentCollector({filter: () => true, dispose: true})
        .on("collect", async (interaction) => {
            let member = interaction.member;
            if (!member) throw new Error("Impossible de récupérer le membre à l'initiative de l'interaction");

            if (!an1 || !an2) throw new Error("Il manque des roles");
            if (member.roles instanceof GuildMemberRoleManager) {
                if (member.roles.cache.has(anciens!.id)) {
                    return interaction.reply({content: "Les anciens n'ont pas le droit de s'attribuer ce role", ephemeral: true});
                } else {
                    await member.roles.remove([...groups.values(), an1, an2]);
                    await member.roles.add(assignedRole);
                    await member.roles.add(interaction.customId);
                    await interaction.reply({content: "C'est fait!", ephemeral: true});
                }
            }
        });
}


async function autoRoles(options: { client: CustomClient, description: string, roles: Role[] }) {
    let {description, roles, client} = options;
    let guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) throw new Error("Impossible de trouver le serveur");

    let channel = guild.channels.cache.get(AUTO_CHANNEL);
    if (!channel) throw new Error("Il manque des salons");
    if (!channel.isText()) throw new Error("Le salon n'est pas un salon textuel");

    let channelMessages = await channel.messages.fetch();
    let roleEmbed = channelMessages.find((m => m.embeds[0].description === description));

    if (!roleEmbed) {
        let embed = new MessageEmbed()
            .setDescription(description);

        let boutons = splitArray(roles, 5).map((ar: any) => {
            return new MessageActionRow().addComponents(
                ar.map((r: any) => {
                    return new MessageButton()
                        .setCustomId(r.id)
                        .setLabel(r.name)
                        .setStyle("PRIMARY");
                }));
        });
        roleEmbed = await channel.send({embeds: [embed], components: boutons});
    }

    roleEmbed.createMessageComponentCollector({filter: () => true, dispose: true})
        .on("collect", async (interaction) => {
            let member = interaction.member;
            if (!member) throw new Error("Impossible de récupérer le membre à l'initiative de l'interaction");

            if (member.roles instanceof GuildMemberRoleManager) {
                if (member!.roles.cache.has(interaction.customId)) {
                    await member.roles.remove(interaction.customId);
                    return interaction.reply({content: "Role retiré!", ephemeral: true});
                } else {
                    await member.roles.add(interaction.customId);
                    await interaction.reply({content: "Role ajouté!", ephemeral: true});
                }
            }
        });
}
