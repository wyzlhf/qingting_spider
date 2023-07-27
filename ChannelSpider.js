const axios = require('axios')
const JSSoup = require('jssoup').default;
const puppeteer = require('puppeteer');

function getChannelUrl(channel_id) {
    channel_url=`https://www.qtfm.cn/channels/${channel_id}/`
    return channel_url
}
async function getPageNum(channel_url) {
    const browser=await puppeteer.launch({headless: "new"});
    const page=await browser.newPage()
    await page.goto(channel_url)
    const res=await page.$eval('.pagination',el=>el.innerHTML)
    const soup = new JSSoup(res);
    const page_all_li_tags=soup.findAll('li')
    const page_all_li_tags_length=page_all_li_tags.length
    const last_page_soup=page_all_li_tags[page_all_li_tags_length-2]
    const las_page_num=last_page_soup.find('a').text
    await browser.close()

    return las_page_num
}
async function getAllPageUrlInChannel(channel_id){
    let all_page_url=[]
    // let channel_url=`https://www.qtfm.cn/channels/353596/${}`
    let channel_url=getChannelUrl(channel_id)
    await getPageNum(channel_url).then(res=>{
        for(let i=0;i<res;i++){
            all_page_url.push(`https://www.qtfm.cn/channels/353596/${i+1}`)
        }
    })
    return all_page_url
}

getAllPageUrlInChannel('353596').then(res=>{
    console.log(res)
})
