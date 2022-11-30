import { EmbedFieldData } from 'discord.js';
import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    // If no specific command is called, show all filtered commands.
    if (!args[0]) {
        // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
        const myCommands = client.commands.filter(
            (cmd) =>
                client.levelCache[cmd.conf.permLevel] <= message.author.level
        );

        let currentCategory = '';
        const fields: EmbedFieldData[] = [];
        let fieldsNum = 0;
        const sorted = myCommands
            .array()
            .sort((p, c) =>
                p.help.category > c.help.category
                    ? 1
                    : p.conf.name > c.conf.name &&
                      p.help.category === c.help.category
                    ? 1
                    : -1
            );
        sorted.forEach((c) => {
            const cat = c.help.category;
            if (currentCategory !== cat) {
                if (currentCategory !== '') fieldsNum += 1;
                fields[fieldsNum] = { name: `${cat}`, value: '' };
                currentCategory = cat;
            }
            fields[
                fieldsNum
            ].value += `${message.settings.prefix}${c.conf.name} - ${c.help.description}\n`;
        });

        message.channel.send(
            client.embed(
                {
                    title: 'Meus comendos',
                    description: `**Use ${message.settings.prefix}help <comando> para detalhes**`,
                    fields: fields,
                },
                message
            )
        );
    } else {
        // Show individual command's help.
        const cmd = args[0];
        if (client.commands.has(cmd)) {
            const command = client.commands.get(cmd);
            if (!command) return;
            if (
                message.author.level < client.levelCache[command.conf.permLevel]
            )
                return;
            message.channel.send(
                client.embed(
                    {
                        title: 'Comando',
                        fields: [
                            {
                                name: 'Descrição:',
                                value: command.help.description,
                            },
                            {
                                name: 'Modo de uso:',
                                value:
                                    message.settings.prefix +
                                    command.help.usage,
                            },
                            {
                                name: 'Aliases:',
                                value: command.conf.aliases.join(', '),
                            },
                        ],
                    },
                    message
                )
            );
        }
    }
};
export const conf = {
    name: 'help',
    aliases: ['h', 'ajuda'],
    permLevel: 'User',
};
export const help = {
    category: 'System',
    description:
        'Ver todos os comandos para sua permissão.',
    usage: 'help [comando]',
};
