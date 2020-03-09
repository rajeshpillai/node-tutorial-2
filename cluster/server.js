// Test using 
//   ab -c200 -t10 http://localhost:8080
// npm install -g loadtest
// OR loadtest -c 10 --rps 200 -t 10 http://localhost:8080
// Run 200 concurrent request for 10 seconds

const http = require('http');
const pid = process.pid;

http.createServer((req, res) => {
  for (let i=0; i<1e7; i++); // simulate CPU work
  res.end(`Handled by process ${pid}`);
}).listen(8080, () => {
  console.log(`Started process ${pid}`);
});
