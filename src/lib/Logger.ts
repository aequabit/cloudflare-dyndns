import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { vsprintf } from 'sprintf-js';

import config from '../core/config';

export default class Logger {
    private static readonly __logPath = path.join(
        __dirname, '..', '..', config.logPath, moment().format('DD.MM.YYYY'));

    public static log(level: string, prefix: string, format: string, ...args: any[]) {
        const timestamp = moment().format('DD.MM.YYYY HH:mm:ss');
        const log = vsprintf(format, args);
        const final = `[${timestamp}] [${level}] [${prefix}] ${log}`;

        // tslint:disable-next-line
        console.log(final);

        fs.appendFile(Logger.__logPath, final + '\n', {}, err => {
            if (err !== null)
                throw err;
        });
    }

    public static error(prefix: string, format: string, ...args: any[]) {
        this.log('error', prefix, format, ...args);
    }

    public static warn(prefix: string, format: string, ...args: any[]) {
        this.log('warn', prefix, format, ...args);
    }

    public static info(prefix: string, format: string, ...args: any[]) {
        this.log('info', prefix, format, ...args);
    }

    public static debug(prefix: string, format: string, ...args: any[]) {
        this.log('debug', prefix, format, ...args);
    }
}
