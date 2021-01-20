const http = require('https');
const fs = require('fs');

const file = fs.createWriteStream("nuget.exe");
http.get("https://dist.nuget.org/win-x86-commandline/v5.8.1/nuget.exe", response => response.pipe(file));
