const download = require('download');
const fs = require('fs');
const axios = require('axios')

video_url='https://hwod-sign.qtfm.cn/m4a/5e89a30dd93ae5ef53b77cf8_16183934_24.m4a?auth_key=64c4efc4-821269-0-f389c5530b15c5fd5fb69f42d1b81779'


async function loadAudio(url,dist,file_name){
    fs.writeFileSync(dist+file_name,await download(url))
}

loadAudio(video_url,'./','2.m4a')