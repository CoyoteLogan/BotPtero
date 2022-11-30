import { JSPteroAPIError } from '@linux123123/jspteroapi';
import { Guild, MessageEmbed } from 'discord.js';
import { Bot } from '../classes/Client';
import { Message } from '../classes/Message';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';
import { GuildSettings } from '../interfaces/GuildSettings';

export const defaultSettings: GuildSettings = {
    prefix: '!',
    adminRole: 'Administrator',
    modRole: 'Moderator',
    embedColor: '#ff0000',
};

export class Functions {
    /* PERMISSION LEVEL FUNCTION */
    public permlevel(client: Bot, message: Message): number {
        let permlvl = 0;

        const permOrder = client.config.permLevels
            .slice(0)
            .sort((p, c) => (p.level < c.level ? 1 : -1));

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (!currentLevel) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    }
    /* GUILD SETTINGS FUNCTION */

    // getSettings merges the client defaults with the guild settings. guild settings in
    // enmap should only have *unique* overrides that are different from defaults.
    public getSettings(client: Bot, guild?: Guild): GuildSettings {
        client.settings.ensure('default', defaultSettings);
        if (!guild) return defaultSettings;
        const guildConf = client.settings.get(guild.id) || {};
        return { ...defaultSettings, ...guildConf };
    }
    /* Loading commands */
    public async loadCommand(client: Bot, commandName: string): Promise<void> {
        try {
            client.logger.log(`Carregando comandos: ${commandName}`);
            const cmd: Command = await import(`../commands/${commandName}`);
            client.commands.set(cmd.conf.name, cmd);
            cmd.conf.aliases.forEach((alias) => {
                client.aliases.set(alias, cmd.conf.name);
            });
        } catch (e) {
            client.logger.error(`Não foi possivel carregar o comando ${commandName}`);
            console.error(e);
        }
    }
    /* Loading events */
    public async loadEvent(client: Bot, eventName: string): Promise<void> {
        try {
            client.logger.log(`Carregando eventos: ${eventName}`);
            const event: Event = await import(`../events/${eventName}`);
            client.on(eventName, event.run.bind(null, client));
        } catch (e) {
            client.logger.error(`Não foi possivel carregar o evento ${eventName}`);
            console.error(e);
        }
    }
    /* Permission error handling */
    public permissionError(
        client: Bot,
        message: Message,
        cmd: Command
    ): MessageEmbed {
        return client.embed(
            {
                title: 'Sem permissão',
                fields: [
                    {
                        name: '\u200b',
                        value: `**Seu nivel de permissão é ${message.author.level} (${message.author.levelName})**`,
                    },
                    {
                        name: '\u200b',
                        value: `**Para utilizar esse comando você precisa ser ${
                            client.levelCache[cmd.conf.permLevel]
                        } (${cmd.conf.permLevel})**`,
                    },
                ],
            },
            message
        );
    }
    /*
    SINGLE-LINE AWAITMESSAGE
    const response = await client.awaitReply(msg, "Favourite Color?");
    msg.reply(`Oh, I really love ${response} too!`);
    */
    public async awaitReply(
        msg: Message,
        question: string,
        limit = 60000
    ): Promise<string> {
        const filter = (m: Message) => m.author.id === msg.author.id;
        await msg.channel.send(question);
        const collected = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: limit,
            errors: ['time'],
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return collected.first()!.content;
    }
    /* Create Error */
    public handleCmdError(client: Bot, e: JSPteroAPIError): string {
        client.logger.error(`Um erro foi eonctrado: ${e}`);
        console.error(e);
        if (e.ERRORS) {
            const err: JSPteroAPIError = e;
            if (e.ERRORS[0])
                return `Teve um erro: ${err.ERRORS.join(' ')}`;
            return `Teve um erro: ${err.HTML_STATUS_TEXT}`;
        }
        return 'Teve um erro!';
    }
}
