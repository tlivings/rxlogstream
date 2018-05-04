'use strict';

const Test = require('tape');
const Logger = require('../lib/index');

Test('test data', (t) => {
    t.plan(7);

    const logger = Logger.createLogger('mylogger');

    const subscription = logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp.ts}(${timestamp.ticks}) ${source}/${name}: ${data}`);
            t.equal(source, 'rxlogstream', 'source is correct.');
            t.equal(name, 'mylogger', 'name is correct.');
            t.equal(typeof timestamp, 'object', 'timestamp is an object.');
            t.equal(typeof timestamp.ts, 'number', 'timestamp ts is a number.');
            t.equal(typeof timestamp.ticks, 'number', 'timestamp ticks is a number.');
            t.ok(Array.isArray(tags), 'tags is an array.');
            t.equal(data, 'hello world', 'data is correct.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    logger.log('hello world');
});

Test('test no date cache', (t) => {
    t.plan(7);

    const logger = Logger.createLogger('mylogger', { dateCache: false });

    const subscription = logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp.ts}(${timestamp.ticks}) ${source}/${name}: ${data}`);
            t.equal(source, 'rxlogstream', 'source is correct.');
            t.equal(name, 'mylogger', 'name is correct.');
            t.equal(typeof timestamp, 'object', 'timestamp is an object.');
            t.equal(typeof timestamp.ts, 'number', 'timestamp ts is a number.');
            t.equal(timestamp.ticks, 0, 'timestamp ticks is 0.');
            t.ok(Array.isArray(tags), 'tags is an array.');
            t.equal(data, 'hello world', 'data is correct.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    logger.log('hello world');
});

Test('test sub modules', (t) => {
    t.plan(3);

    const m1 = require('./fixtures/m1');

    const subscription = m1.logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp.ts}(${timestamp.ticks}) ${source}/${name}: ${data}`);
            t.equal(source, 'm1', 'source is correct.');
            t.equal(name, 'm1Logger', 'name is correct.');
            t.ok(data, 'received data.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    m1.test();
});

Test('test global events', (t) => {
    t.plan(2);

    const logger = Logger.createLogger('mylogger');
    const logger2 = Logger.createLogger('mylogger2');

    const subscription = Logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp.ts}(${timestamp.ticks}) ${source}/${name}: ${data}`);
            t.pass('event received.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    logger.log('hello world');
    logger2.log('hello world');
});
