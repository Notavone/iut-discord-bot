const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const request = require("request");

module.exports = (client, interaction) => {
    let name = interaction.options.get("groupe")?.value;
    let week = interaction.options.get("decalage")?.value || 1;

    const groups = [
        new Group('S1', 4641),
        new Group('S1-A', 4670),
        new Group('S1-A1', 4673),
        new Group('S1-A2', 4674),
        new Group('S1-B', 4668),
        new Group('S1-B1', 4676),
        new Group('S1-B2', 4675),
        new Group('S1-C', 4669),
        new Group('S1-C1', 4677),
        new Group('S1-C2', 4678),
        new Group('S1-D', 4671),
        new Group('S1-D1', 4679),
        new Group('S1-D2', 4680),
        new Group('S2', 4683),
        new Group('S2-A', 4690),
        new Group('S2-A1', 4691),
        new Group('S2-A2', 4692),
        new Group('S2-B', 4684),
        new Group('S2-B1', 4685),
        new Group('S2-B2', 4686),
        new Group('S2-C', 4687),
        new Group('S2-C1', 4688),
        new Group('S2-C2', 4689),
        new Group('S2-D', 4693),
        new Group('S2-D1', 4694),
        new Group('S2-D2', 4695),
        new Group('S3', 4699),
        new Group('S3-A', 4706),
        new Group('S3-A1', 4707),
        new Group('S3-A2', 4708),
        new Group('S3-B1', 4701),
        new Group('S3-B', 4700),
        new Group('S3-B2', 4702),
        new Group('S3-C', 4703),
        new Group('S3-C1', 4704),
        new Group('S3-C2', 4705),
        new Group('S3-D', 4709),
        new Group('S3-D1', 4710),
        new Group('S3-D2', 4711),
        new Group('S4', 10873),
        new Group('S4-A', 10878),
        new Group('S4-A1', 10874),
        new Group('S4-A2', 10875),
        new Group('S4-B', 10879),
        new Group('S4-B1', 10876),
        new Group('S4-B2', 10877),
        new Group('S4-C', 16236),
        new Group('S4-C1', 16238),
        new Group('S4-C2', 19973),
        new Group("Teprow_I", 14494),
        new Group("Teprow_A", 14502)
    ];
    const group = groups.find((grp) => grp.name.replace("-", "").toLowerCase() === name.replace("-", "").toLowerCase());
    if (!group) return interaction.editReply({content: "J'ai pas reconnu le groupe désolé"});
    group.displayEDT(interaction, week);
};

module.exports.slash = {
    ephemeral: false,
    data: new SlashCommandBuilder()
        .setName("edt")
        .setDescription("Donne l'EDT")
        .addStringOption(o => o
            .setName("groupe")
            .setDescription("Un groupe ou un groupe étendu (S1/S1-A/S1-A2)")
            .setRequired(true)
        )
        .addNumberOption(o => o
            .setName("decalage")
            .setDescription("Le nombre de semaine de décalage (defaut 1)")
            .addChoice("-1", -1)
            .addChoice("1", 1)
            .addChoice("2", 2))
};

class Group {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    displayEDT(interaction, week) {
        request(`https://sedna.univ-fcomte.fr/jsp/custom/ufc/mplanif.jsp?id=${this.id}&jours=${(7 * week).toString()}`, async (err, res, body) => {
            if (err) throw err;
            const url = body.match(/<a href="(.*)">Affichage planning<\/a>/)[1]
                .replace("vesta", "sedna")
                .replace(":8443", "")
                .replace(/&width=[0-9]*&height=[0-9]*&/, '&width=960&height=540&');
                // .replace('&idPianoDay=0%2C1%2C2%2C3%2C4%2C5', '&idPianoDay=0%2C1%2C2%2C3%2C4');
            const embed = new MessageEmbed()
                .setTitle(`Emploi du temps du groupe ${this.name}`)
                .setDescription(`${week === 1 ? 'semaine actuelle' : `+${week - 1} semaine(s)`}`)
                .setImage(url);
            await interaction.editReply({embeds: [embed]});
        });
    }
}
