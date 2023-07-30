const puppeteer = require('puppeteer');
const JSSoup = require('jssoup').default;


//返回的是Promise
async function getChannelPageNum(channel_url) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage()
    await page.goto(channel_url)
    const res = await page.$eval('.pagination', el => el.innerHTML)
    const soup = new JSSoup(res);
    const page_all_li_tags = soup.findAll('li')
    const page_all_li_tags_length = page_all_li_tags.length
    const last_page_soup = page_all_li_tags[page_all_li_tags_length - 2]
    const last_page_num = last_page_soup.find('a').text
    await browser.close()

    return last_page_num
}
module.exports=getChannelPageNum