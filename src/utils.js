const Canvas = require("canvas");
const fs = require("fs");

module.exports.splitArray = (array, limit) => {
    let newArray = [];
    array.sort();
    while (array.length > 0) {
        newArray.push(array.splice(0, limit));
    }
    return newArray;
};

module.exports.memberCanvas = async (member) => {
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
};

module.exports.getFiles = getFiles;

function getFiles(directory, aFiles) {
    const files = fs.readdirSync(directory);
    aFiles = aFiles ?? [];
    files.forEach((file) => {
        const path = `${directory}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            aFiles = getFiles(path, aFiles);
        } else {
            aFiles.push(path);
        }
    })
    return aFiles;
}
