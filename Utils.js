const axios = require('axios')
const https = require('https')
const download = require('download');
const fs = require('fs');

async function getAuthorID(channel_id) {
    let url = `https://i.qtfm.cn/capi/v3/channel/${channel_id}?user_id=null`
    let res = await axios.get(url)
    return res['data']['data']['v']
}

function includeSomeCharacter(url, some_character) {
    return url.includes(some_character)
}

async function loadAudio(url, file_name, type = '.m4a', dist = './') {
    fs.writeFileSync(dist + file_name + type, await download(url))
}

module.exports = {
    // getAllChannelURLs,
    getAuthorID,
    includeSomeCharacter,
    loadAudio
}