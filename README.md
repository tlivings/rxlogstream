# rxlogstream

An RxJS global Subject based logging utility.

### API

- `createLogger(name)` - creates a new logger instance with an optional name.
- `observe()` - return a new Observable of the global log stream.

*Instance*

- `log(/* optional */ tags, data)` - log the given data, optionally with tags.
- `observe()` - return a new Observable of the global log stream filtered by logger name.

### Observable data

The log stream data stream is an object containing:

- `source` - the module name (`window` on client side) where the log instance was created.
- `name` - the logger name.
- `timestamp` - the timestamp of the log event.
- `tags` - an array of tags for the log entry.
- `data` - the logged data.

### Usage

```javascript
const logger = Logger.createLogger('mylogger');

const logstream = logger.observe();

logstream.subscribe(
    ({ source, name, timestamp, tags, data }) => {
        console.log(`${timestamp} ${source}/${name}: ${data}`);
    }
);

logger.log('hello world');
```
