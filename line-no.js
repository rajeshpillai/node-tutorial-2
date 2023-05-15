function f1() {
  console.log("f1 called");
  console.log(f1.caller.name);
  f2();
}

function f2() {
  console.log("f2 called");
  console.log(f2.caller.name);
  //console.log(new Error().stack);
}

function debugLine(message) {
  let e = new Error();
  // change to 3 for grandparent func
  let frame = e.stack.split("\n")[2]; 
  let lineNumber = frame.split(":").reverse()[1];
  let functionName = frame.split(" ")[5];
  return functionName + ":" + lineNumber + " " + message;
}

function myCallingFunction() {
  console.log(debugLine("error_message"));
}



function run() {
  f1();
}

run();
myCallingFunction();




