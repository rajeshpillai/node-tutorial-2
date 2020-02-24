# Streams 101

There are four fundamental stream types in Node.js: Readable, Writable, Duplex, and Transform streams.

    - A readable stream is an abstraction for a source from which data can be consumed. 
      An example of that is the fs.createReadStream method.
    - A writable stream is an abstraction for a destination to which data can be written. 
      An example of that is the fs.createWriteStream method.
    - A duplex streams is both Readable and Writable. An example of that is a TCP socket.
    - A transform stream is basically a duplex stream that can be used to modify or 
      transform the data as it is written and read. 
      An example  of  that is the zlib.createGzip stream to compress the data using gzip. 
      You can think of a transform stream as a function where the input is the writable stream part 
      and the output is readable stream part. You might also hear transform streams referred to as “through streams.”

All streams are instances of EventEmitter. They emit events that can be used to read and write data. However, we can consume streams data in a simpler way using the pipe method.


The pipe method

Here’s the magic line that you need to remember:

readableSrc.pipe(writableDest)

In this simple line, we’re piping the output of a readable stream — the source of data, as the input of a writable stream — the destination. The source has to be a readable stream and the destination has to be a writable one. Of course, they can both be duplex/transform streams as well. In fact, if we’re piping into a duplex stream, we can chain pipe calls just like we do in Linux:

readableSrc
  .pipe(transformStream1)
  .pipe(transformStream2)
  .pipe(finalWrtitableDest)

The pipe method returns the destination stream, which enabled us to do the chaining above. For streams a (readable), b and c (duplex), and d (writable), we can:

a.pipe(b).pipe(c).pipe(d)

# Which is equivalent to:
a.pipe(b)
b.pipe(c)
c.pipe(d)


# Which, in Linux, is equivalent to:
$ a | b | c | d

The pipe method is the easiest way to consume streams. It’s generally recommended to either use the pipe method or consume streams with events, but avoid mixing these two. Usually when you’re using the pipe method you don’t need to use events, but if you need to consume the streams in more custom ways, events would be the way to go.

# Stream events

Beside reading from a readable stream source and writing to a writable destination, the pipe method automatically manages a few things along the way. For example, it handles errors, end-of-files, and the cases when one stream is slower or faster than the other.

However, streams can also be consumed with events directly. Here’s the simplified event-equivalent code of what the pipe method mainly does to read and write data:

# readable.pipe(writable)

readable.on('data', (chunk) => {
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
});



  The events and functions are somehow related because they are usually used together.

The most important events on a readable stream are:

    The data event, which is emitted whenever the stream passes a chunk of data to the consumer
    The end event, which is emitted when there is no more data to be consumed from the stream.

The most important events on a writable stream are:

    The drain event, which is a signal that the writable stream can receive more data.
    The finish event, which is emitted when all data has been flushed to the underlying system.

Events and functions can be combined to make for a custom and optimized use of streams. To consume a readable stream, we can use the pipe/unpipe methods, or the read/unshift/resume methods. To consume a writable stream, we can make it the destination of pipe/unpipe, or just write to it with the write method and call the end method when we’re done.

Paused and Flowing Modes of Readable Streams

Readable streams have two main modes that affect the way we can consume them:

    They can be either in the paused mode
    Or in the flowing mode

Those modes are sometimes referred to as pull and push modes.

All readable streams start in the paused mode by default but they can be easily switched to flowing and back to paused when needed. Sometimes, the switching happens automatically.

When a readable stream is in the paused mode, we can use the read() method to read from the stream on demand, however, for a readable stream in the flowing mode, the data is continuously flowing and we have to listen to events to consume it.

In the flowing mode, data can actually be lost if no consumers are available to handle it. This is why, when we have a readable stream in flowing mode, we need a data event handler. In fact, just adding a data event handler switches a paused stream into flowing mode and removing the data event handler switches the stream back to paused mode. Some of this is done for backward compatibility with the older Node streams interface.

To manually switch between these two stream modes, you can use the resume() and pause() methods.

When consuming readable streams using the pipe method, we don’t have to worry about these modes as pipe manages them automatically.


## Implementing Streams

When we talk about streams in Node.js, there are two main different tasks:

    The task of implementing the streams.
    The task of consuming them.

So far we’ve been talking about only consuming streams. Let’s implement some!

Stream implementers are usually the ones who require the stream module.

Implementing a Writable Stream

To implement a writable stream, we need to to use the Writable constructor from the stream module.

const { Writable } = require('stream');

We can implement a writable stream in many ways. We can, for example, extend the Writable constructor if we want

class myWritableStream extends Writable {
}

However, I prefer the simpler constructor approach. We just create an object from the Writable constructor and pass it a number of options. The only required option is a write function which exposes the chunk of data to be written.

const { Writable } = require('stream');

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(outStream);

This write method takes three arguments.

    The chunk is usually a buffer unless we configure the stream differently.
    The encoding argument is needed in that case, but usually we can ignore it.
    The callback is a function that we need to call after we’re done processing the data chunk. It’s what signals whether the write was successful or not. To signal a failure, call the callback with an error object.

In outStream, we simply console.log the chunk as a string and call the callback after that without an error to indicate success. This is a very simple and probably not so useful echo stream. It will echo back anything it receives.

To consume this stream, we can simply use it with process.stdin, which is a readable stream, so we can just pipe process.stdin into our outStream.

When we run the code above, anything we type into process.stdin will be echoed back using the outStream console.log line.

This is not a very useful stream to implement because it’s actually already implemented and built-in. This is very much equivalent to process.stdout. We can just pipe stdin into stdout and we’ll get the exact same echo feature with this single line:

``` 
process.stdin.pipe(process.stdout);
```
