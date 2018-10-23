import * as cloudflare from 'cloudflare';

import { IConfig } from '../core/config';

export interface IRecord {
    id: string;
}

export default class CloudFlare {
    private readonly _config: IConfig = null;
    private readonly _cloudFlare: any = null;

    public constructor(config: IConfig) {
        this._config = config;
        this._cloudFlare = cloudflare({
            email: this._config.email,
            key: this._config.apikey
        });
    }

    public getConfig(): IConfig {
        return this._config;
    }

    public async updateRecord(ipAddress: string): Promise<void> {
        const record = await this._getRecord();

        this._cloudFlare.dnsRecords
            .edit(this._config.zoneId, record.id, {
                type: this._config.type,
                name: this._config.domain,
                content: ipAddress,
                ttl: this._config.ttl,
                proxied: this._config.proxied
            });
    }

    private async _getRecord(): Promise<IRecord> {
        const dnsRecord = await this._cloudFlare.dnsRecords
            .browse(this._config.zoneId);

        return dnsRecord.result
            .find(x => x.name === this._config.domain) as IRecord;
    }
}
