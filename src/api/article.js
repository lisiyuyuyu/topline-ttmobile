// 封装所有与文章相关的网络请求

function apiGetChannelArticle (axios, { url, method, query }) {
  return axios({
    url,
    method,
    params: query
  })
}

// 对文章不喜欢
function apiNotLikeArticle (axios, { url, method }) {
  return axios({
    url,
    method
  })
}

// 举报文章
function apiReportArticle (axios, { target, type }) {
  return axios({
    url: '/article/reports',
    method: 'POST',
    data: {
      target: target,
      type: type,
      remark: ''
    }
  })
}
// 按需导出
export { apiGetChannelArticle, apiNotLikeArticle, apiReportArticle }
