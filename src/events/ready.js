const {splitArray} = require("../utils");
const {MessageEmbed} = require("discord.js");
const {MessageButton} = require("discord.js");
const {MessageActionRow} = require("discord.js");
module.exports = async (client) => {
    let guild = client.guilds.cache.get("355396372809121792");
    let role1 = guild.roles.cache.get("486169138671386646");
    let role2 = guild.roles.cache.get("487185971805421579");
    let anciens = guild.roles.cache.get("486070633164439553");
    let salonAutoRole = guild.channels.cache.get("881954802249113621");
    let rolesDeClasse = guild.roles.cache.filter(r => r.name.match(/S\d-.\d/) !== null);

    async function createCollectorForRolesStartingWith(embedText, roleDisciminator, roleAnnee) {
        let msg = (await salonAutoRole.messages.fetch()).find((m => m.embeds[0].description === embedText));
        let embed = new MessageEmbed()
            .setDescription(embedText);
        let roles = guild.roles.cache.filter(r => r.name.startsWith(roleDisciminator));

        let boutons = splitArray([...roles.values()], 5).map(ar => {
            return new MessageActionRow().addComponents(
                ar.map(r => {
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

                if (mem.roles.cache.has(anciens.id)) {
                    return interaction.reply({content: "Tu peux pas t'es un ancien, enculé", ephemeral: true});
                } else {
                    await mem.roles.remove(rolesDeClasse);
                    await mem.roles.remove([role1, role2]);
                    await mem.roles.add(roleAnnee);
                    await mem.roles.add(roles.get(interaction.customId));
                    await interaction.reply({content: "C'est fait ma gueule", ephemeral: true});
                }
            });
    }

    async function autoRoles(embedText, roles) {
        let msg = (await salonAutoRole.messages.fetch()).find((m => m.embeds[0].description === embedText));
        let embed = new MessageEmbed()
            .setDescription(embedText);

        let boutons = splitArray(roles, 5).map(ar => {
            return new MessageActionRow().addComponents(
                ar.map(r => {
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
                if (mem.roles.cache.has(interaction.customId)) {
                    await mem.roles.remove(interaction.customId);
                    return interaction.reply({content: "Bye bye le role!", ephemeral: true});
                } else {
                    await mem.roles.add(interaction.customId);
                    await interaction.reply({content: "C fé!", ephemeral: true});
                }
            });
    }

    let newsABII = guild.roles.cache.get("822162045641162771");
    let bogareurs = guild.roles.cache.get("884034441121517568");

    await createCollectorForRolesStartingWith("1ère année", "S1-", role1);
    await createCollectorForRolesStartingWith("2ème année", "S3-", role2);
    await autoRoles("Les roles spéciaux", [newsABII, bogareurs]);

    // client.emit("guildMemberAdd", guild.me);
    // client.emit("guildMemberRemove", guild.me);
}
