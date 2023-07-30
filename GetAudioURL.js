const puppeteer = require('puppeteer');
const {includeSomeCharacter} = require('./Utils')


async function getAudioURL(m_program_page_url) {
    let urls = ''
    let audio_url = ''
    const browser = await puppeteer.launch({
        headless: "new"
    }).catch(() => browser.close);

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.on('request', request => {
        request.continue();
    });
    await page.on('response', response => {
        // console.log(response.url())
        urls += response.url() + ','
    });
    await page.goto(m_program_page_url).catch(() => browser.close);
    await browser.close();
    let url_list = urls.split(',')
    url_list.forEach(url => {
        if (includeSomeCharacter(url, 'https://hwod-sign.qtfm.cn/m4a')) {
            audio_url = url
        }
    })

    return audio_url
}

module.exports = getAudioURL