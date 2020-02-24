console.log(__dirname);
console.log(__filename);

console.log(process.cwd());

try {
    console.log("changing directory to /");
    process.chdir("/");
} catch(e) {
    console.error("chdir error: ", e.message);
}

console.log(process.cwd());
console.log(__dirname);
