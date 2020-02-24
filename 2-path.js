const path = require("path");

let directories = ["bin","output", "public"];
let directory = directories.join(path.sep);

console.log("directory path: ", directory);

// More examples
var fileName = "/app/controller/home.js";
var file = path.basename(fileName);
var extension = path.extname(fileName);

console.log("Filename: ", file);
console.log("Ext: ", extension);