import { getStationNameCh } from "@/api/api.ts"
import content from "@/main.ts"
import Vue from "vue"
const keyStationDict = 'keyStationDict'
var vue = new Vue()

export const loadStationDictChCookie = (self) => {
    // console.log(self)
    getStationNameCh().then(res => {
        if (res.status === 200) {
            self.$cookie.set(keyStationDict, res.data)
        }
    })
}

export const getStationDictChCookie = (self) => {
    return self.$cookie.get(keyStationDict)
}

export var checkStationDictCookieExist = (self) => {
    // console.log(content)
    // var vue=new Vue();
    if (self.$cookie.get(keyStationDict) != null) {
        return true
    }
    else {
        return false
    }
}