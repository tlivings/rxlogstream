'use strict';

import { Subject } from 'rxjs/Subject';
import Individual from 'individual';

//Operators for this file
require('rxjs/add/operator/share'); //eslint-disable-line no-undef
require('rxjs/add/operator/filter'); //eslint-disable-line no-undef

const logStream = Individual('__rxlogstream', new Subject());

const SERVER_ENV = !(typeof window != 'undefined' && window.document); //eslint-disable-line no-undef

const uptime = function () {
    return process.uptime() * 1000; //eslint-disable-line no-undef
};

const createLogger = function (name = '') {
    const startTime = SERVER_ENV ? Date.now() - uptime() : Date.now();
    const source = SERVER_ENV ? require('callermodule')().name : 'window'; //eslint-disable-line no-undef

    return {
        log(...args /* ...tags, data */) {
            const timestamp = SERVER_ENV ? startTime + uptime() : Date.now();
            const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
            const data = args[args.length - 1];

            logStream.next({ source, name, timestamp, tags, data });
        },
        observe() {
            return logStream.share().filter((x) => x.name === name && x.source === source);
        }
    };
};

const observe = function () {
    return logStream.share();
};

module.exports = { createLogger, observe }; //eslint-disable-line no-undef
