import { getStationNameCh } from '@/api/api.ts'
import content from '@/main.ts'
import { INameCH } from '@/common/dict/NameCH.ts'
import Vue from 'vue'
const keyStationDict = 'keyStationDict'
// cookie过期时间（单位：day）
const expiredDay = 1
var vue = new Vue()

export const loadStationDictChCookie = self => {
  // console.log(self)
  getStationNameCh().then(res => {
    if (res.status === 200) {
      // 注意此处还需要一个判断，判断res.data的长度
      if (res.data.length > 0) {
        // 需要使用序列化器
        // 注意不使用序列化器了，因为序列化器若后台的这个 测站名称的字典过大，会导致无法存储
        // 改为使用localStorage
        var jsonData: String = JSON.stringify(res.data)
        localStorage[keyStationDict] = jsonData
        // 设置默认一天后过期
        // self.$cookie.set(keyStationDict, jsonData, expiredDay)
      }
    }
  })
}

export const getStationDictChCookie = self => {
  // var jsonData: string = JSON.parse(self.$cookie.get(keyStationDict))
  var jsonData: Array<INameCH> = JSON.parse(localStorage[keyStationDict])
  return jsonData
}

export var checkStationDictCookieExist = self => {
  // console.log(content)
  // var vue=new Vue();
  if (
    localStorage.getItem(keyStationDict) != null &&
    localStorage.getItem(keyStationDict) != ''
    // self.$cookie.get(keyStationDict) != null &&
    // self.$cookie.get(keyStationDict) != ''
  ) {
    return true
  } else {
    return false
  }
}
