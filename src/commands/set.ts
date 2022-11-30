/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RunFunction } from '../interfaces/Command';
import { GuildSettings } from '../interfaces/GuildSettings';

export const run: RunFunction = async (
    client,
    message,
    [action, key, ...value]
) => {
    // Retrieve current guild settings (merged) and overrides only.
    const settings = message.settings;
    const defaults = client.settings.get('default')!;
    const overrides = client.settings.get(message.guild!.id)!;
    if (!client.settings.has(message.guild!.id))
        client.settings.set(message.guild!.id, {} as GuildSettings);

    // Edit an existing key value
    if (action === 'edit') {
        // User must specify a key.
        if (!key) return message.reply('Por favor, informe a key');
        // User must specify a key that actually exists!
        if (!defaults[key])
            return message.reply('Essa Key não existe');
        const joinedValue = value.join(' ');
        // User must specify a value to change.
        if (joinedValue.length < 1)
            return message.reply('Informe a key');
        // User must specify a different value than the current one.
        if (joinedValue === settings[key])
            return message.reply('A key informada é a mesma da configurada!');

        // If the guild does not have any overrides, initialize it.
        if (!client.settings.has(message.guild!.id))
            client.settings.set(message.guild!.id, {} as GuildSettings);

        // Modify the guild overrides directly.
        client.settings.set(message.guild!.id, joinedValue, key);

        // Confirm everything is fine!
        message.reply(`${key} editada para ${joinedValue}`);
    }

    // Resets a key to the default value
    else if (action === 'del' || action === 'reset') {
        if (!key) return message.reply('Informe a key que deseja modificar.');
        if (!defaults[key])
            return message.reply('Essa key não existe');
        if (!overrides[key])
            return message.reply(
                'Já esta como padrão.'
            );

        const response = await client.functions.awaitReply(
            message,
            `Você deseja resetar a key ${key} para padrão?`
        );

        // If they respond with y or yes, continue.
        if (['s', 'sim'].includes(response.toLowerCase())) {
            // We delete the `key` here.
            client.settings.delete(message.guild!.id, key);
            message.reply(`${key} resetada com sucesso para padrão.`);
        }
        // If they respond with n or no, we inform them that the action has been cancelled.
        else if (['n', 'no', 'cancel'].includes(response)) {
            message.reply(
                `Configuração da key \`${key}\` modificada para \`${settings[key]}\``
            );
        }
    } else if (action === 'get') {
        if (!key) return message.reply('Por favor, me informe a key que deseja ver');
        if (!defaults[key])
            return message.reply('Key inexistente');
        const isDefault = !overrides[key]
            ? '\nEssa configuração é global.'
            : '';
        message.reply(
            `A ${key} atualmente é ${settings[key]}${isDefault}`
        );
    } else {
        // Otherwise, the default action is to return the whole configuration;
        const array: string[] = [];
        Object.entries(settings).forEach(([key, value]) => {
            array.push(`${key}${' '.repeat(20 - key.length)}::  ${value}`);
        });
        await message.channel.send(
            `= Informações atual do servidor =\n${array.join('\n')}`,
            { code: 'asciidoc' }
        );
    }
};
export const conf = {
    name: 'set',
    aliases: ['setting', 'settings', 'conf'],
    permLevel: 'Administrator',
};

export const help = {
    category: 'System',
    description: 'Ver ou editar informações do sistema.',
    usage: 'set <view/get/edit> <key> <value>',
};
