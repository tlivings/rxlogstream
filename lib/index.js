'use strict';

const { Subject } = require('rxjs/Subject');
const Individual = require('individual');

//Operators for this file
require('rxjs/add/operator/share');
require('rxjs/add/operator/filter');

const logStream = Individual('__rxlogstream', new Subject());

const SERVER_ENV = !(typeof window !== 'undefined' && window.document);

const clear = function () {
    now.cached = null;
};

const now = function () {
    if (!SERVER_ENV) {
        return Date.now();
    }

    if (now.cached !== null) {
        now.cached.ontick++;
        return now.cached;
    }

    now.cached = { ts: Date.now(), ontick: 1 };

    process.nextTick(clear);

    return now.cached;
};

now.cached = null;

const createLogger = function (name = '', { dateCache = true } = {}) {
    const source = SERVER_ENV ? require('callermodule')().name : 'window';

    const timeFunction = dateCache === false ? () => {
      return { ts: Date.now(), ontick: 1 };
    } : now;

    return {
        log(...args /* ...tags, data */) {
            const timestamp = timeFunction();
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

module.exports = { createLogger, observe };
