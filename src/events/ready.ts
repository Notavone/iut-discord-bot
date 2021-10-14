import {CustomClient, getFiles, splitArray} from "../utils";
import {Collection, GuildMemberRoleManager, Message, MessageActionRow, MessageButton, MessageEmbed, Role, Snowflake, TextChannel} from "discord.js";
import * as path from "path";
module.exports = async (client: CustomClient) => {
    console.log("Salut ma gueule");

    let guild = client.guilds.cache.get("355396372809121792");
    if (!guild) return console.log("Il manque un serveur");
    let role1 = guild.roles.cache.get("486169138671386646");
    let role2 = guild.roles.cache.get("487185971805421579");
    let anciens = guild.roles.cache.get("486070633164439553");
    let salonAutoRole = <TextChannel>guild.channels.cache.get("881954802249113621");
    if (!role1 || !role2 || !anciens || !salonAutoRole) return console.log("Il manque des salons");
    let rolesDeClasse = guild.roles.cache.filter(r => r.name.match(/S\d-.\d/) !== null);

    async function createCollectorForRolesStartingWith(embedText: string, roleDiscriminator: string, roleAnnee: Role) {
        let msg = (await salonAutoRole.messages.fetch()).find((m => m.embeds[0].description === embedText));
        let embed = new MessageEmbed()
            .setDescription(embedText);
        let roles = guild!.roles.cache.filter(r => r.name.startsWith(roleDiscriminator));
        let orderedNames = roles.map(r => r.name).sort();
        let orderedRoles = orderedNames.map(name => roles.find(r => r.name === name));

        let boutons = splitArray([...orderedRoles.values()], 5).map((ar: any) => {
            return new MessageActionRow().addComponents(
                ar.map((r: any) => {
                    return new MessageButton()
                        .setCustomId(r.id)
                        .setLabel(r.name)
                        .setStyle("PRIMARY");
                }));
        });

        if (!msg) msg = await salonAutoRole.send({embeds: [embed], components: boutons});

        msg.createMessageComponentCollector({filter: () => true, dispose: true})
            .on("collect", async (interaction) => {
                let mem = interaction.member;
                if (!mem) return interaction.reply({content: "Oups j'ai fait de la merde, contacte Léo"});

                if (mem.roles instanceof GuildMemberRoleManager) {
                    if (mem.roles.cache.has(anciens!.id)) {
                        return interaction.reply({content: "Tu peux pas t'es un ancien, enculé", ephemeral: true});
                    } else {
                        await mem.roles.remove(rolesDeClasse);
                        await mem.roles.remove([role1!, role2!]);
                        await mem.roles.add(roleAnnee);
                        await mem.roles.add(interaction.customId);
                        await interaction.reply({content: "C'est fait ma gueule", ephemeral: true});
                    }
                }
            });
    }

    async function autoRoles(embedText: string, roles: Role[]) {
        let msg = (await salonAutoRole.messages.fetch()).find((m => m.embeds[0].description === embedText));
        let embed = new MessageEmbed()
            .setDescription(embedText);

        let boutons = splitArray(roles, 5).map((ar: any) => {
            return new MessageActionRow().addComponents(
                ar.map((r: any) => {
                    return new MessageButton()
                        .setCustomId(r.id)
                        .setLabel(r.name)
                        .setStyle("PRIMARY");
                }));
        });

        if (!msg) msg = await salonAutoRole.send({embeds: [embed], components: boutons});

        msg.createMessageComponentCollector({filter: () => true, dispose: true})
            .on("collect", async (interaction) => {
                let mem = interaction.member;
                if (!mem) return interaction.reply({content: "Oups j'ai fait de la merde, contacte Léo"});

                if (mem.roles instanceof GuildMemberRoleManager) {
                    if (mem!.roles.cache.has(interaction.customId)) {
                        await mem.roles.remove(interaction.customId);
                        return interaction.reply({content: "Bye bye le role!", ephemeral: true});
                    } else {
                        await mem.roles.add(interaction.customId);
                        await interaction.reply({content: "C fé!", ephemeral: true});
                    }
                }
            });
    }

    let ff = [...guild.channels.cache.filter(c => c.isText()).values()];
    for (let i = 0; i < ff.length; i++) {
        let c = <TextChannel>ff[i];
        console.log(c.name)
        let messages: Collection<Snowflake, Message>;
        let before: string | undefined = undefined;
        if (c.id === "355396372809121794") before = "890531464582692874";
        do {
            messages = await c.messages.fetch({limit: 100, before});
            if (!messages.last()) continue;
            before = messages.last()!.id;
            for (let msg of [...messages.filter(m => m.author.id === "178896511378259968").values()]) {
                console.log(msg.content);
                msg.delete()
                    .catch((_) => {
                    });
            }
            new Promise((resolve) => setTimeout(() => resolve(1000)));
        }
        while (messages.size > 0);
    }

    let newsABII = guild.roles.cache.get("822162045641162771");
    let bogareurs = guild.roles.cache.get("884034441121517568");
    if (!newsABII || !bogareurs) return console.log("Il manque un role spécial");

    await createCollectorForRolesStartingWith("1ère année", "S1-", role1);
    await createCollectorForRolesStartingWith("2ème année", "S3-", role2);
    await autoRoles("Les roles spéciaux", [newsABII, bogareurs]);

    let commandFiles = getFiles(path.join(__dirname, "../commands")) ?? [];
    for (const commandFile of commandFiles) {
        let command = require(commandFile);
        await client.commands.set(command.slash.data.name, command);
    }

    for (let guild of [...client.guilds.cache.values()]) {
        await guild.commands.set(client.commands.map(cmd => cmd.slash.data));
    }
}
