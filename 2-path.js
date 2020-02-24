const path = require("path");

let directories = ["bin","output", "public"];
let directory = directories.join(path.sep);

console.log("directory path: ", directory);