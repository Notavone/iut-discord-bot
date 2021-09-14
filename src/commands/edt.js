const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const request = require("request");

module.exports = (client, interaction) => {
    let name = interaction.options.get("groupe")?.value;
    let week = interaction.options.get("decalage")?.value || 1;

    const groups = [
        new Group('s1', 4641),
        new Group('s1-a', 4670),
        new Group('s1-a1', 4673),
        new Group('s1-a2', 4674),
        new Group('s1-b', 4668),
        new Group('s1-b1', 4676),
        new Group('s1-b2', 4675),
        new Group('s1-c', 4669),
        new Group('s1-c1', 4677),
        new Group('s1-c2', 4678),
        new Group('s1-d', 4671),
        new Group('s1-d1', 4679),
        new Group('s1-d2', 4680),
        new Group('s2', 4683),
        new Group('s2-a', 4690),
        new Group('s2-a1', 4691),
        new Group('s2-a2', 4692),
        new Group('s2-b', 4684),
        new Group('s2-b1', 4685),
        new Group('s2-b2', 4686),
        new Group('s2-c', 4687),
        new Group('s2-c1', 4688),
        new Group('s2-c2', 4689),
        new Group('s2-d', 4693),
        new Group('s2-d1', 4694),
        new Group('s2-d2', 4695),
        new Group('s3', 4699),
        new Group('s3-a', 4706),
        new Group('s3-a1', 4707),
        new Group('s3-a2', 4708),
        new Group('s3-b1', 4701),
        new Group('s3-b', 4700),
        new Group('s3-b2', 4702),
        new Group('s3-c', 4703),
        new Group('s3-c1', 4704),
        new Group('s3-c2', 4705),
        new Group('s3-d', 4709),
        new Group('s3-d1', 4710),
        new Group('s3-d2', 4711),
        new Group('s4', 10873),
        new Group('s4-a', 10878),
        new Group('s4-a1', 10874),
        new Group('s4-a2', 10875),
        new Group('s4-b', 10879),
        new Group('s4-b1', 10876),
        new Group('s4-b2', 10877),
        new Group('s4-c', 16236),
        new Group('s4-c1', 16238),
        new Group('s4-c2', 19973)
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
                .replace(/&width=[0-9]*&height=[0-9]*&/, '&width=1080&height=720&')
                .replace('&idPianoDay=0%2C1%2C2%2C3%2C4%2C5', '&idPianoDay=0%2C1%2C2%2C3%2C4');
            const embed = new MessageEmbed()
                .setTitle(`Emploi du temps du groupe ${this.name.toUpperCase()}`)
                .setDescription(`${week === 1 ? 'semaine actuelle' : `+${week - 1} semaine(s)`}`)
                .setImage(url);
            await interaction.editReply({embeds: [embed]});
        });
    }
}
