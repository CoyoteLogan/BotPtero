import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args[0])
        return message.reply('Você precisa me informar o id do servidor!');
    try {
        const res = await client.app.reinstallServer(parseInt(args[0]));
        await message.delete();
        const msg = await message.channel.send(
            client.embed({
                title: res,
                color: message.settings.embedColor,
                timestamp: new Date(),
            })
        );
        msg.delete({ timeout: 3000 });
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};
export const conf = {
    name: 'reinstalar',
    aliases: [''],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Reinstalar um servidor',
    usage: 'reinstalar <sid do servidor>',
};
