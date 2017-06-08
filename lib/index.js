'use strict';

const CallerModule = require('callermodule');
const { EventEmitter } = require('events');

const EVENT = Symbol.for('log$');

const clear = function () {
    now.cached = null;
};

const now = function () {
    if (now.cached !== null) {
        return now.cached;
    }

    now.cached = Date.now();

    process.nextTick(clear);

    return now.cached;
};

now.cached = null;

class Logger {
    constructor(name, source) {
        this._name = name;
        this._source = source;
    }
    log(...args /* ...tags, data */) {
        if (process.listenerCount(EVENT) > 0) {
            const timestamp = now();
            const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
            const data = args[args.length - 1];
            process.emit(EVENT, { source: this._source, name: this._name, timestamp, tags, data });
        }
    }
}

const API = {
    addListener(listener) {
        process.on(EVENT, listener);
    },
    removeListener(listener) {
        process.removeListener(EVENT, listener);
    },
    createLogger(name) {
        const source = CallerModule();
        return new Logger(name, source.name);
    }
};

module.exports = API;
