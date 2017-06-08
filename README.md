# rxlogstream

A logging utility utilizing the `process` object as a global event emitter.

### API

- `createLogger(name)` - creates a new logger instance with an optional name.
- `addListener(listener)` - registers a listener to the log events.
- `removeListener(listener)` - removes the given listener.

*Instance*

- `log(/* optional */ tags, data)` - log the given data, optionally with tags.

### Event data

The log stream data event is an object containing:

- `source` - the module name (`window` on client side) where the log instance was created.
- `name` - the logger name.
- `timestamp` - the timestamp of the log event.
- `tags` - an array of tags for the log entry.
- `data` - the logged data.

### Usage

```javascript
const logger = Logger.createLogger('mylogger');

Logger.addListener(({ source, name, timestamp, tags, data }) => {
    console.log(`${timestamp} ${source}/${name}: ${data}`);
});

logger.log('hello world');
```
