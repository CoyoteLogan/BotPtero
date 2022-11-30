import { RunFunction } from '../interfaces/Event';
export const run: RunFunction = (client, error) => {
    client.logger.error(`Um erro foi encontrado: ${error}`);
    console.error(error);
};
