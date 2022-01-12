import {CustomClient} from "./utils";
import {Collection, GuildMember, Role, Snowflake} from "discord.js";

export default function (client: CustomClient) {
    return new Promise<void>( (resolve) => {
        client.once('ready', async () => {
            let serv = client.guilds.cache.get("355396372809121792");
            if (!serv) throw new Error("Oups");

            // let rolesS1 = serv.roles.cache.filter((r) => r.name.startsWith("S1"));
            // let rolesS2 = serv.roles.cache.filter((r) => r.name.startsWith("S2"));
            // let rolesS3 = serv.roles.cache.filter((r) => r.name.startsWith("S3"));
            // let rolesS4 = serv.roles.cache.filter((r) => r.name.startsWith("S4"));

            // up(rolesS1);
            // up(rolesS3);

            // for (let member of serv.members.cache.values()) {
            //     await removeRoles(member)
            // }

            resolve();
        });
    })
}

export async function up(roles: Collection<Snowflake, Role>) {
    for (let role of roles.values()) {
        let split = role.name.split("-");
        let num = Number(split[0][1]);
        let subRole = split[1];
        let newName = `S${num + 1}-${subRole}`;

        console.log(`${role.name} -> ${newName}`);
        await role.setName(newName);
    }
}

export async function down(roles: Collection<Snowflake, Role>) {
    for (let role of roles.values()) {
        let split = role.name.split("-");
        let num = Number(split[0][1]);
        let subRole = split[1];
        let oldName = role.name;
        let newName = `S${num - 1}-${subRole}`;

        await role.setName(newName);
        console.log(`${oldName} -> ${newName}`);
    }
}

export async function removeRoles(member: GuildMember) {
    for (let role of member.roles.cache.filter((r) => r.name.match(/S\d-.\d/) !== null).values()) {
        await member.roles.remove(role);
        console.log(`${member.user.username} perd ${role.name}`);
    }
}
