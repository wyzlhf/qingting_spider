const download = require('download');
const fs = require('fs');

async function getAudio(url, file_name, type = '.m4a', dist = './') {
    fs.writeFileSync(dist + file_name + type, await download(url))
}
module.exports=getAudio