/*
整理一下整个思路：
1、更定Channel_id拼出Channel的URL——对应getChannelURL
2、通过Channel_url获取该Channel下一共有多少页面，即page_num——对应getChannelPageNum
3、获取所有programs。这个不是使用HTML解析，而是根据Ajax的特定请求链接。即通过循环所有页数的请求，获取所有program_id，
   并主城json或字典即Object——对应getAllPrograms
4、遍历所有program_id，根据program_id和Channel_id获取真实audio_url。https://hwod-sign.qtfm.cn/m4a/5e89a30dd93ae5ef53b77cf8_16183934_24.m4a?
   auth_key=64c4efc4-821269-0-f389c5530b15c5fd5fb69f42d1b81779。——对应getAudioURL
5、并根据audio_url立即开始下载，因为这个URL是有时效性的。——对应loadAudio。
*/
const getChannelUrl = require('./GetChannelURL')
const getChannelPageNum = require('./GetChannelPageNum')
const {getAuthorID} = require('./Utils')
const getAllPrograms = require('./GetAllPrograms')
const getAudioURL = require('./GetAudioURL')
const getAudio=require('./GetAudio')

async function main(channel_id) {
    let channel_url = await getChannelUrl(channel_id)
    let author_v = await getAuthorID(channel_id)
    let page_num = await getChannelPageNum(channel_url)
    let all_programs = await getAllPrograms(author_v, channel_id, page_num)
    let all_audio_info=[]
    console.log('下载前请创建下载目录，如果没有目录会报错哦！')
    for(let i=0;i<all_programs.length;i++){
        console.log(`正在处理第${i+1}个下载，请耐心等候……`)
        let program=all_programs[i]
        let program_id = program['id']
        let program_title = program['title']
        let m_program_page_url = `https://m.qtfm.cn/vchannels/${channel_id}/programs/${program_id}`
        let audio_url = await getAudioURL(m_program_page_url)
        await getAudio(audio_url,program_title)
        console.log(`完成第${i+1}个下载，标题为：${program_title}`)
        console.log('-----------------------------------')
    }
    console.log('完成全部下载，感谢使用，下次再见。')
    console.log('===================================')
}

var channel_id = '309755'
main(channel_id)
