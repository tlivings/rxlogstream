'use strict';

const Test = require('tape');
const Logger = require('../lib/index');

Test('test data', (t) => {
    t.plan(5);

    const logger = Logger.createLogger('mylogger');

    const subscription = logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp} ${source}/${name}: ${data}`);
            t.equal(source, 'rxlogstream', 'source is correct.');
            t.equal(name, 'mylogger', 'name is correct.');
            t.equal(typeof timestamp, 'number', 'timestamp is a number.');
            t.ok(Array.isArray(tags), 'tags is an array.');
            t.equal(data, 'hello world', 'data is correct.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    logger.log('hello world');
});

Test('test global events', (t) => {
    t.plan(1);

    const logger = Logger.createLogger('mylogger');

    const subscription = Logger.observe().subscribe(
        ({ source, name, timestamp, tags, data }) => {
            console.log(`${timestamp} ${source}/${name}: ${data}`);
            t.pass('event received.');
        }
    );

    t.on('end', () => {
        subscription.unsubscribe();
    });

    logger.log('hello world');
});
