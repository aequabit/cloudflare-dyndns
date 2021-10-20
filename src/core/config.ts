import * as config from '../../config.json';

export interface IConfig {
    logPath: string;
    email?: string;
    apikey?: string;
    token?: string;
    zoneId: string;
    domain: string;
    type: string;
    ttl: number;
    proxied: boolean;
}

export default new Proxy((config as any) as IConfig, {
    get: (obj, prop) => prop in obj ? obj[prop] : undefined
});
