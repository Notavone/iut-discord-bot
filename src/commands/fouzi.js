const {SlashCommandBuilder} = require("@discordjs/builders");
let phrases = [
    "**Monsieur.**",
    "Sortez vos résumés.",
    "Sortez **TDé TPay**.",
    "Lisez votre TDay.",
    "Lisez votre TPay.",
    "Sortez votre TDay.",
    "Sortez votre TPé.",
    "**echo toto**",
    "On va dans ce sens messieurs, sinon c'est derrière.",
    "C'est quoi la tablette ASCII.",
    "Monsieur vous êtes boursier et vous vous permettez de parler ! vous pouvez partir.",
    "Monsieur s'est écrit dans ton résumé.",
    "Je n'ai pas reçu votre rapport au format P.D.F.",
    "**Tu me casses le cul.**",
    "**echo** \"Bonjour les amis\"",
    "Dans le monde de Linux, **tout est fichier.**",
    "**Backslash**",
    "cd **point point**",
    "C'est un __tuuuuuuuube__.",
    "Eh monsieur, tu connais Star Wars ?",
    "Pas esperluette monsieur, *et commercial*.",
    "Monsieur, c'est pas moins grand que, c'est plus petit que.",
    "Dollar IFS c'est pas drôle, dollar IFS çà fait chier !",
    "ar -c fait la compilation. On fait pas la compilation.",
    "au niveau de compilateur, il ne sait pas ou trouver le bibliothèque.",
    "On fait pas la compilation.",
    "C'est marqué dans votre TDay.",
    "C'est marqué dans votre TPay.",
    "Le TDay est en chinois, alors.",
    "C'est en chinois.",
    "Au niveau système",
    "Niveau système",
    "Tu me casses la tête",
    "C'est interdit de rôter et de pêter.",
    "Dans linux **tout est fichier**",
    "Monsieur vous avez pas écrit dans votre TP vous avez pas le droit à la parole.",
    "Misieu, Missieu, vous avez rien compris!",
    "Binjour",
    "On est en système ! on parle commande, on parle pas français !",
    "Si tu parles pas commande tu parle chinois",
    "Quand je pose une question,je ne veux pas du francais je veux une commande",
    "cd..",
    "Monsieur, enfin regarder votre TDay.",
    "faut appeler une ambulance",
    "Okay ?",
    "C'est parti pour une demi-heure !",
    "Prennez des notes !",
    "Chaine de caract**èèè**re",
    "Accent courconflex",
    "Il ne sait pas ce que c'est un nombre!",
    "``*/*/*/\\*/*/\\*``",
    "étoile . étoile /étoile ./étoile ../étoile /étoile/étoile /étoile/. étoile",
    "Écrivez l'exemple sinon vous comprendrez rien!",
    "C'est bon ?",
    "T'as rien fait!",
    "Est-ce-que cous avez des questions? Sinon on continue!",
    "C'est bon ? Ça marche ? Okay ?",
    "ln lsr ça fait pas rigoler!",
    "On s'installe sous home",
    "Vous êtes sous haume, vous ché vous...",
    "ÇA CLIGNOTE ROUGE !!",
    "..OK ?..",
    "Lés Slaïdes...",
    "Il é ou le spéctakle ?",
    "Tapez echo BLAH BLAH....",
    "Pk tu rigoles ?...",
    "Tape le ! Tape ! Tape ! Tape le monsieur ! Tape **echo blabla** !"
];

module.exports = async (client, interaction) => {
    await interaction.editReply({
        content: phrases[Math.floor(Math.random() * phrases.length)]
    })
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("fouzi")
        .setDescription("Fouzi..")
}
