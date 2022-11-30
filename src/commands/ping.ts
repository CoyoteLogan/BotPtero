import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    const embed = client.embed(
        {
            title: '**🏓 PING!**',
            fields: [
                {
                    name: 'BOT Latência',
                    value: `**${Date.now() - message.createdTimestamp}ms**`,
                },
                {
                    name: 'Discord API Latência',
                    value: `**${Math.round(client.ws.ping)}ms**`,
                },
            ],
        },
        message
    );
    message.channel.send(embed);
};
export const conf = {
    name: 'ping',
    aliases: ['latency'],
    permLevel: 'User',
};

export const help = {
    name: 'ping',
    category: 'Miscelaneous',
    description: 'Latência do bot',
    usage: 'ping',
};
