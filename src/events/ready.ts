import { RunFunction } from '../interfaces/Event';
import { defaultSettings } from '../modules/Functions';
export const run: RunFunction = (client) => {
    client.logger.ready(
        `${client.user?.tag}, pronto para cuidar de ${client.users.cache.size} membros em ${client.guilds.cache.size} servidores.`
    );
    client.user?.setActivity(`${defaultSettings.prefix}help`, {
        type: 'PLAYING',
    });
    client.user?.setUsername('LGN Store - Host Manager');
    client.continueCmd.forEach((cmd, key) => {
        const command = client.commands.get(cmd.command);
        if (command && command.setup) {
            client.logger.cmd(`Configurando comando ${command.conf.name}`);
            command.setup(client, key, cmd);
        }
    });
};
