import config from './core/config';

import CloudFlare from './lib/CloudFlare';
import Logger from './lib/Logger';
import { randomIpService } from './lib/IPService';

// CloudFlare has a limit of 1200 calls every five minutes
const UPDATE_INTERVAL = 10 * 1000;

const cf = new CloudFlare(config);
let lastIp = null;

const updateDnsEntry = async () => {
    const ipService = randomIpService();

    let ip = await ipService();

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
