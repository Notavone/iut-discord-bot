const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageAttachment} = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = (client, interaction) => {
    let name = interaction.options.get("groupe")?.value;

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
    const group = groups.find((grp) => grp.name === name);
    if(!group) return interaction.editReply({context: "Nope"});
    group.displayEDT(interaction);
};

module.exports.slash = {
    ephemeral: false,
    data: new SlashCommandBuilder()
        .setName("edt")
        .setDescription("Donne l'emploi du temps (mdr)")
        .addStringOption(o => o
            .setName("groupe")
            .setDescription("Un groupe ou un groupe étendu (S1/S1-A/S1-A2)")
            .setRequired(true)
        )
};

class Group {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    displayEDT(interaction) {
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setViewport({
                width: 1280,
                height: 800
            });
            await page.goto(`https://sedna.univ-fcomte.fr/jsp/custom/ufc/mplanif.jsp?id=${this.id}&jours=1`);
            let buffer = await page.screenshot({
                path: 'edt.png',
                fullPage: true
            });
            if(!Buffer.isBuffer(buffer)) return interaction.editReply({content: "ça marche pas mon pote"});
            let attachment = new MessageAttachment(buffer, "edt.png");
            await interaction.editReply({files: [attachment]});
            await browser.close();
        })();
    }
}
