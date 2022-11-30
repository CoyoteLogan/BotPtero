import { inspect } from 'util';
import { RunFunction } from '../interfaces/Command';
import { defaultSettings } from '../modules/Functions';
export const run: RunFunction = async (
    client,
    message,
    [action, key, ...value]
) => {
    if (action === 'editar') {
        if (!key) return message.reply('Por favor, me fale qual key deseja editar');
        if (!defaultSettings[key])
            return message.reply('Key não existe no meu sistema');
        if (value.length < 1)
            return message.reply('Por favor, digite a key');

        defaultSettings[key] = value.join(' ');

        client.settings.set('default', defaultSettings);
        message.reply(`${key} editada com sucesso para ${value.join(' ')}`);
    }
    // Display a key's default value
    else if (action === 'pegar') {
        if (!key) return message.reply('Por favor, fale qual key deseja ver');
        if (!defaultSettings[key])
            return message.reply('Key não existe no meu sistema');
        message.reply(
            `A ${key} atualmente é ${defaultSettings[key]}`
        );
    }
    // Display all default settings.
    else {
        await message.channel.send(
            `***__Configuração inicial do bot__***\n\`\`\`json\n${inspect(
                defaultSettings
            )}\n\`\`\``
        );
    }
};
export const conf = {
    name: 'conf',
    aliases: ['defaults'],
    permLevel: 'Logan',
};

export const help = {
    category: 'System',
    description: 'Modificar a permissão padrão dos servidores.',
    usage: 'conf <ver/pegar/editar> <key> <value>',
};
