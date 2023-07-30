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
const getChannelUrl=require('./GetChannelURL')
const getChannelPageNum=require('./GetChannelPageNum')
const {getAllChannelURLs,getAuthorID,loadAudio}=require('./Utils')
const getAllPrograms=require('./GetAllPrograms')
const getAudioURL=require('./GetAudioURL')

async function main(channel_id) {
    let channel_url=getChannelUrl(channel_id)
    await getAuthorID(channel_id).then(author_v=>{
        getChannelPageNum(channel_url).then(page_num=>{
            for(let num=0;num<page_num;num++){
                getAllPrograms(author_v,channel_id,num+1).then(all_programs=>{
                    all_programs.forEach(program=>{
                        let program_id=program['id']
                        let program_title=program['title']
                        let m_program_page_url=`https://m.qtfm.cn/vchannels/${channel_id}/programs/${program_id}`
                        getAudioURL(m_program_page_url).then(audio_url=>{
                            loadAudio(audio_url,program_title)
                        })
                    })
                })
            }
        })
    })
}

var channel_id='353596'
// var author_v="4cd6c5c3c4827aac9412115330701e2c"
// var page_num='1'
// getAllPrograms(author_v,channel_id,page_num).then(res=>{
//     console.log(res)
// })
main(channel_id)