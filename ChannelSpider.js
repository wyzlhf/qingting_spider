const axios = require('axios')
const JSSoup = require('jssoup').default;
const puppeteer = require('puppeteer');
const Puppeteer = require("puppeteer");
const fs = require('fs');

function getChannelUrl(channel_id) {
    channel_url = `https://www.qtfm.cn/channels/${channel_id}/`
    return channel_url
}

async function getPageNum(channel_url) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage()
    await page.goto(channel_url)
    const res = await page.$eval('.pagination', el => el.innerHTML)
    const soup = new JSSoup(res);
    const page_all_li_tags = soup.findAll('li')
    const page_all_li_tags_length = page_all_li_tags.length
    const last_page_soup = page_all_li_tags[page_all_li_tags_length - 2]
    const las_page_num = last_page_soup.find('a').text
    await browser.close()

    return las_page_num
}

async function getAllPageUrlInChannel(channel_id) {
    let all_page_url = []
    // let channel_url=`https://www.qtfm.cn/channels/353596/${}`
    let channel_url = getChannelUrl(channel_id)
    await getPageNum(channel_url).then(res => {
        for (let i = 0; i < res; i++) {
            all_page_url.push(`https://www.qtfm.cn/channels/353596/${i + 1}`)
        }
    })
    return all_page_url
}

async function getAuthorID(channel_id) {
    let url = `https://i.qtfm.cn/capi/v3/channel/${channel_id}?user_id=null`
    let author_v = ''
    await axios.get(url).then(res => {
        author_v = res['data']['data']['v']
    })
    return author_v
}

async function getAllProgramsInChannel(channel_id) {
    // let all_programs = []
    await getAuthorID(channel_id).then(author_id => {
        let page_url = getChannelUrl(channel_id)
        getPageNum(page_url).then(page_num => {
            for (let num = 0; num < page_num; num++) {
                let url = `https://i.qtfm.cn/capi/channel/${channel_id}/programs/${author_id}?curpage=${num + 1}&pagesize=30&order=asc`
                axios.get(url).then(res_json => {
                    let items = res_json['data']['data']['programs']
                    items.forEach(item=>{
                        console.log(item)
                    })
                })//可以从这里获取真是下载链接，然后下载了，写一个获取audio的函数，一个下载函数
            }
        })
    })
}
async function getRealAudioURL(audio_page_url=null) {
    const browser = await Puppeteer.launch({
        headless: "new"
    }).catch(() => browser.close);

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        console.log(request.url());
        request.continue();
    });
    page.on('response', response => {
        console.log(response.url());
    });
    page.on('requestfailed', request => {
        console.log(request.url());
    });
    page.on('requestfinished', request => {
        console.log(request.url());
    });

    await page.goto(audio_page_url).catch(() => browser.close);
    //await page.waitFor(500);

    await browser.close();
}
function includeSomeCharacter(url,some_character) {
    return url.includes(some_character)
}

function loadAudiotoPath(path,content){
    fs.writeFile(path,content,err=>{
        if (err){
            console.log(err)
        }else {
            console.log('写入文件成功')
        }
    })
}
// getAllProgramsInChannel('353596').then(res => {
//     console.log(res)
// })
// const url='https://m.qtfm.cn/vchannels/353596/programs/14647412/'
// getRealAudioURL(url)


// url='https://hwod-sign.qtfm.cn/m4a/5e89a30dd93ae5ef53b77cf8_16183934_24.m4a?auth_key=64c285c9-628393-0-0fb3cee313d6437269748afe8df79223'
// some_character='https://hwod-sign.qtfm.cn/m4a'
// console.log(includeSomeCharacter(url,some_character))

// axios.get(url).then(res=>{
//     loadAudiotoPath('1.m4a',res)
// })