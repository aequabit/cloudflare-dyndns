import * as request from 'request-promise';

import config from './core/config';

import CloudFlare from './lib/CloudFlare';
import Logger from './lib/Logger';

// CloudFlare has a limit of 1200 calls every five minutes
const UPDATE_INTERVAL = 10 * 1000;

const getIp = async (): Promise<string> => {
    const response = await request({ uri: 'https://wtfismyip.com/json' });

    try {
        return JSON.parse(response).YourFuckingIPAddress;
    } catch (err) {
        return null;
    }
}

(async (): Promise<void> => {
    Logger.info('cloudflare', 'Started DNS updater');

    const cf = new CloudFlare(config);

    setInterval(async () => {
        const ip = await getIp();

        if (ip === null) {
            Logger.error('ip', 'Failed to get IP address');
            return;
        }

        try {
            await cf.updateRecord(ip);
            Logger.info('cloudflare', 'Updated IP for %s to %s', cf.getConfig().domain, ip);
        } catch (err) {
            Logger.error('cloudflare', 'Error while getting external IP: %s', err.message);
        }

    }, UPDATE_INTERVAL);
})();