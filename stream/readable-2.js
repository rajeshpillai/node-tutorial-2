/*
When the read method is called on a readable stream, the 
implementation can push partial data to the queue. 

For example, we can push one letter at a time, starting 
with character code 65 (which represents A), and 
incrementing that on every push:

NOTE:
While the consumer is reading a readable stream, the read method will continue 
to fire, and we’ll push more letters. We need to stop this cycle somewhere, 
and that’s why an if statement to push null when the currentCharCode is greater 
than 90 (which represents Z).

This code is equivalent to the simpler one we started with but now we’re pushing 
data on demand when the consumer asks for it. You should always do that.
*/

const {Readable} = require("stream");
const inStream = new Readable({
    read(size) {
        this.push(String.fromCharCode(this.currentCharCode++));
        if (this.currentCharCode > 90) {
            this.push(null);
        }
    }
});

inStream.currentCharCode = 65;

inStream.pipe(process.stdout);