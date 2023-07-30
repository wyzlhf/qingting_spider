const axios = require('axios')

async function getAllPrograms(author_v, channel_id, page_num) {
    let all_programs = []
    for (let num = 0; num < page_num; num++) {
        let url = `https://i.qtfm.cn/capi/channel/${channel_id}/programs/${author_v}?curpage=${num + 1}&pagesize=30&order=asc`
        await axios.get(url).then(res => {
            let items = res['data']['data']['programs']
            items.forEach(item => {
                all_programs.push(item)
            })
        })
    }
    return all_programs
}

module.exports = getAllPrograms