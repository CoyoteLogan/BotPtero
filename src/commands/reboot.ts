import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message) => {
    await message.reply('Bot reiniciando.');
    client.destroy();
    process.exit(0);
};
export const conf = {
    name: 'reboot',
    aliases: [],
    permLevel: 'Logan',
};

export const help = {
    category: 'System',
    description:
        'Reiniciar o bot.',
    usage: 'reboot',
};
