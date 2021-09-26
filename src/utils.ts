import {ApplicationCommandData, Client, ClientOptions, Collection, GuildMember, Interaction, Permissions} from "discord.js";
import * as Canvas from "canvas";
import * as fs from "fs";

export function splitArray(array: any[], limit: number) {
    let newArray = [];
    while (array.length > 0) {
        newArray.push(array.splice(0, limit));
    }
    return newArray;
}

export async function memberCanvas(member: GuildMember) {
    let canvas = Canvas.createCanvas(700, 250);
    let context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./wallpaper.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#0099ff';
    context.strokeRect(0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'jpg'}));
    context.drawImage(avatar, 25, 25, 200, 200);


    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.font = '28px sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

    let fontSize = 70;
    do {
        context.font = `${fontSize -= 10}px sans-serif`;
    } while (context.measureText(member.user.username).width > canvas.width - 300);

    context.fillStyle = '#ffffff';
    context.fillText(member.user.username, canvas.width / 2.5, canvas.height / 1.8);

    return canvas;
}

export function getFiles(directory: string, aFiles?: string[]) {
    const files = fs.readdirSync(directory);
    files.forEach((file: string) => {
        const path = `${directory}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            aFiles = getFiles(path, aFiles);
        } else {
            if (!aFiles) aFiles = [];
            aFiles.push(path);
        }
    });
    return aFiles;
}

export class CustomClient extends Client {
    commands: Collection<string, Command>;
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}

export interface Command {
    execute: (client:CustomClient, interaction:Interaction) => any,
    slash: {
        permissionFlags?: Permissions[],
        ephemeral?: boolean,
        data: ApplicationCommandData
    }
}
