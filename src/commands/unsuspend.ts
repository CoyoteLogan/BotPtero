import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args[0])
        return message.reply('Você precisa me informar o id do servidor!');
    try {
        const res = await client.app.unSuspendServer(parseInt(args[0]));
        await message.delete();
        const msg = await message.channel.send(
            client.embed(
                {
                    title: res,
                },
                message
            )
        );
        msg.delete({ timeout: 3000 });
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'unsuspend',
    aliases: [''],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Reviver um servidor',
    usage: 'unsuspend <server id>',
};
