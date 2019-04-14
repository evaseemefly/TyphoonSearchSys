import axios from "axios";

// 后端的请求地址及端口
// tslint:disable-next-line:typedef
export const host = "http://127.0.0.1:8000";
// export const host = 'http://128.5.6.112:8015'
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  // tslint:disable-next-line:max-line-length
  // 'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept,access-control-allow-methods,access-control-allow-origin',
  // 'Access-Control-Allow-Headers': 'Content-Type',
  // 'Content-Type': 'application/json;charset=UTF-8',
  // 'Content-Type': 'application/x-www-form-urlencoded',
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
};
// 加载船舶状态信息列表
export interface ITyphoonParams {
  latlon: number[];
  range: number;
}

export interface ITyphoonRealDataParamas {
  code: string;
}

// 选中台风（含时刻）
export interface ITyphoonRealBaseParams {
  code: string;
  name: string;
  date: Date;
}

// tslint:disable-next-line:typedef
export const loadTyphoonList = (par: ITyphoonParams) => {
  // tslint:disable-next-line:typedef
  let typhoonlistUrl = `${host}/gis/filter/range/`;
  return axios.get(typhoonlistUrl, {
    params: par
  });
};

// tslint:disable-next-line:typedef
export const loadTyphoonRealData = (par: ITyphoonRealDataParamas) => {
  // tslint:disable-next-line:typedef
  let typhoonrealdataUrl = `${host}/gis/data/typhoonrealdata/`;
  return axios.get(typhoonrealdataUrl, {
    params: par
  });
};

// 根据 台风（含时间信息）获取潮位站数据
// tslint:disable-next-line:typedef
export const loadStationTideDataList = (par: ITyphoonRealBaseParams) => {
  // tslint:disable-next-line:typedef
  let stationTideUrl = `${host}/gis/data/stationtide/`;
  return axios.get(stationTideUrl, {
    params: par
  });
};
