
//返回的不是Promise
function getChannelUrl(channel_id) {
    channel_url = `https://www.qtfm.cn/channels/${channel_id}/`
    return channel_url
}
module.exports=getChannelUrl