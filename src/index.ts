import * as request from 'request-promise';

import config from './core/config';

import CloudFlare from './lib/CloudFlare';
import Logger from './lib/Logger';

// CloudFlare has a limit of 1200 calls every five minutes
const UPDATE_INTERVAL = 10 * 1000;

const cf = new CloudFlare(config);
let lastIp = null;

const getIp = async (): Promise<string> => {
    try {
        const response = await request({ uri: 'https://api.myip.com' });
        return JSON.parse(response).ip;
    } catch (err) {
        return null;
    }
}

const updateDnsEntry = async () => {
    let ip = await getIp();

    // Failed to get IP
    if (ip === null) {
        Logger.error('app', 'Failed to get IP address');
        return;
    }

    // IP didn't change (will run once because lastIp isn't set initially)
    if (ip === lastIp)
        return;

    if (lastIp !== null)
        Logger.info('app', 'IP change from %s to %s', lastIp, ip);

    lastIp = ip;

    try {
        await cf.updateRecord(ip);

        Logger.info('cloudflare', 'Updated IP for %s to %s', cf.getConfig().domain, ip);
    } catch (err) {
        Logger.error('cloudflare', 'Error while updating DNS record IP: %s', err.message);
    }
};

(async (): Promise<void> => {
    Logger.info('app', 'Started');

    setInterval(async () => await updateDnsEntry(), UPDATE_INTERVAL);
})();
