import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = async (client, warn) => {
    client.logger.warn(`Um aviso foi encontrado: ${warn}`);
    console.warn(warn);
};
