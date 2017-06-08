'use strict';

const Test = require('tape');
const Logger = require('../lib/index');

Test.only('test data', (t) => {
    t.plan(5);

    const logger = Logger.createLogger('mylogger');

    Logger.addListener(({ source, name, timestamp, tags, data }) => {
        console.log(`${timestamp} ${source}/${name}: ${data}`);
        t.equal(source, 'rxlogstream', 'source is correct.');
        t.equal(name, 'mylogger', 'name is correct.');
        t.equal(typeof timestamp, 'number', 'timestamp is a number.');
        t.ok(Array.isArray(tags), 'tags is an array.');
        t.equal(data, 'hello world', 'data is correct.');
    });

    logger.log('hello world');
});
