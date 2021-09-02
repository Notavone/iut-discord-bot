require("dotenv").config();
const Discord = require("discord.js");
const {MessageButton} = require("discord.js");
const {MessageActionRow} = require("discord.js");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS]});


client.on("ready", async () => {
    let guild = client.guilds.cache.get("355396372809121792");
    let role1 = guild.roles.cache.get("486169138671386646");
    let role2 = guild.roles.cache.get("487185971805421579");
    let anciens = guild.roles.cache.get("486070633164439553");
    let salonAutoRole = guild.channels.cache.get("881954802249113621");
    let rolesDeClasse = guild.roles.cache.filter(r => r.name.match(/S\d-.\d/) !== null);

    async function createCollectorForRolesStartingWith(embedText, roleDisciminator, roleAnnee) {
        let msg = (await salonAutoRole.messages.fetch()).find((m => m.embeds[0].description === embedText));
        let embed = new Discord.MessageEmbed()
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

                if (mem.roles.cache.has(anciens)) {
                    return interaction.reply({content: "Tu peux pas t'es un ancien enculé", ephemeral: true});
                } else {
                    await mem.roles.remove(rolesDeClasse);
                    await mem.roles.remove([role1, role2]);
                    await mem.roles.add(roleAnnee);
                    await mem.roles.add(roles.get(interaction.customId));
                    await interaction.reply({content: "Bien joué pd", ephemeral: true});
                }
            });

    }

    await guild.commands.set([require("./edt.js").slash]);
    await createCollectorForRolesStartingWith("1ère année", "S1-", role1);
    await createCollectorForRolesStartingWith("2ère année", "S3-", role2);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "edt") {
        let cmd = require("./edt.js")(client, interaction);
    }
});

function splitArray(array, limit) {
    let newArray = [];
    array.sort();
    while (array.length > 0) {
        newArray.push(array.splice(0, limit));
    }
    return newArray;
}

client.login(process.env.TOKEN).then(() => console.log(""));
