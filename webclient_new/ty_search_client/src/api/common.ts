// TODO:[-] 20-02-07 将所有的共有的常量放在common.ts中
// export const host = 'http://127.0.0.1:8000'
// mac
// export const host = 'http://127.0.0.1:8082'
// home 5820
// export const host = 'http://127.0.0.1:8082'
// - 21-10-13 上线测试的实际地址,注意要去掉/
export const host = 'http://128.5.10.21:8000'
// 22-06-05 尝试加入家中 5820 发布服务的配置
// export const host = 'http://192.168.50.86:8082'

/** @type {*} 21-03-05 + 新添加的用来加载 geoserver的host */
// export const hostGeo = 'http://128.5.10.21:8082/geoserver/'
const baseHost = 'http://128.5.10.21'
// const baseHost = 'http://localhost'
// 22-06-05 尝试加入家中 5820 发布服务的配置
// const baseHost = 'http://192.168.50.86'
// const basePort = '8000' // 单位 7920
const basePort = '8084' // remote | 单位 mac | 5820
// const basePort = '18080' // home mac
// const basePort = '8082'
export const baseUrl = `${baseHost}:${basePort}`
// export const hostGeo = 'http://128.5.10.21:8084/geoserver/'
export const hostGeo = 'http://localhost:18080/geoserver/'
// export const hostGeoCors = 'http://128.5.10.21:18081/geoserver/'
// 本地 cors 的 geoserver url
export const hostGeoCors = 'http://localhost:18080/geoserver/'
