import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    message.reply(
        `Seu level de permissão é: ${message.author.level} - ${message.author.levelName}`
    );
};
export const conf = {
    name: 'mylevel',
    aliases: ['myperms', 'level'],
    permLevel: 'User',
};

export const help = {
    category: 'Miscelaneous',
    description:
        'Ver a permissão da pessoa no servidor.',
    usage: 'mylevel',
};
