import axios from 'axios'

// 后端的请求地址及端口
export const host = 'http://127.0.0.1:8000'
// export const host = 'http://128.5.6.112:8015'
axios.defaults.withCredentials = true
axios.defaults.headers = {
  // 'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept,access-control-allow-methods,access-control-allow-origin',
  // 'Access-Control-Allow-Headers': 'Content-Type',
  // 'Content-Type': 'application/json;charset=UTF-8',
  // 'Content-Type': 'application/x-www-form-urlencoded',
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
}
// 加载船舶状态信息列表
export interface TyphoonParams {
  latlon: number[]
  range: number
}

export const loadTyphoonList = (par: TyphoonParams) => {
  let typhoonlistUrl = `${host}/gis/filter/range/`
  return axios.get(typhoonlistUrl, {
    params: par
  })
}
