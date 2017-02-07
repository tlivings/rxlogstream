'use strict';

import { Subject } from 'rxjs/Subject';
import Individual from 'individual';

//Operators for this file
require('rxjs/add/operator/share'); //eslint-disable-line no-undef
require('rxjs/add/operator/filter'); //eslint-disable-line no-undef

const logStream = Individual('__rxlogstream', new Subject());

const SERVER_ENV = !(typeof window != 'undefined' && window.document); //eslint-disable-line no-undef

const createLogger = function (name = '') {
    const source = SERVER_ENV ? require('callermodule')().name : 'window'; //eslint-disable-line no-undef

    const clear = function () {
        now.cached = null;
    };

    const now = function () {
        if (!SERVER_ENV) {
            return Date.now();
        }

        if (now.cached !== null) {
            return now.cached;
        }

        now.cached = Date.now();

        process.nextTick(clear);

        return now.cached;
    };

    now.cached = null;

    return {
        log(...args /* ...tags, data */) {
            const timestamp = now();
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
