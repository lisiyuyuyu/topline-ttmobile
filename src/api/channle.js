// 封装所有与频道相关的网络请求

// 得到频道的数据
function apiGetChannelList (axios, { url, method }) {
  return axios({
    url: url,
    method: method
  })
}

// 得到所有频道数据
function apiGetAllChannels (axios, { url, method }) {
  return axios({
    url,
    method
  })
}
export { apiGetChannelList, apiGetAllChannels }
