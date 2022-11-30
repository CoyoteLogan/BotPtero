import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args, cmd) => {
    let command = '';
    let serverId: string;
    if (cmd !== 'state') {
        if (!args[0]) return message.reply('Você precisa informar o ID do servidor!');
        command = cmd;
        serverId = args[0];
    } else {
        if (!args[0])
            return message.reply('Você precisa informar o status do servidor!');
        command = args[0];
        if (!args[1]) return message.reply('Você precisa informar o ID do servidor!');
        serverId = args[1];
    }
    try {
        const res = await client.client.setPowerState(
            serverId,
            command as never
        );
        message.channel.send(client.embed({ title: res }, message));
    } catch (e) {
        return message.reply(client.functions.handleCmdError(client, e));
    }
};

export const conf = {
    name: 'state',
    aliases: ['start', 'stop', 'restart', 'kill'],
    permLevel: 'Administrator',
};

export const help = {
    category: 'Pterodactyl',
    description: 'Muda o status do servidor',
    usage: 'start 1',
};
