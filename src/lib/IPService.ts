import * as request from 'request-promise';

export type IPService = () => Promise<string>;

export const newJsonIpService = (uri: string, json_key: string = "ip") => {
    return async () => {
        try {
            const response = await request({ uri });
            return JSON.parse(response)[json_key];
        } catch (err) {
            return null;
        }
    };
}

export const IP_SERVICE_PROVIDERS: IPService[] = [
    newJsonIpService("https://api.myip.com"),
    newJsonIpService("https://api.ipify.org/?format=json"),
    newJsonIpService("https://ip.seeip.org/jsonip"),
    
    async () => {
        try {
            const response = await request({ uri: 'https://whatthefuckismyip.com' });
            const line_ip = response.split("\n")[0];
            return line_ip.replace('yourfuckingip="', "").replace('"', "");
        } catch (err) {
            return null;
        }
    }
];

export const randomIpService = () => IP_SERVICE_PROVIDERS[Math.floor(Math.random() * IP_SERVICE_PROVIDERS.length)];