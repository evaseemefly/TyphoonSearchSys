import axios from "axios";

// export const host = "http://127.0.0.1:8000";
// ʵ�ʲ����ַ���˿�
export const host = "http://128.5.10.26:8000";
// ����docker����
// export const host = 'http://127.0.0.1:32773'
// export const host ="http://127.0.0.1:64807";

axios.defaults.withCredentials = true;
axios.defaults.headers = {};

export const filterByComplexCondition = (
  level,
  wsm,
  bp,
  startMonth,
  endMonth
) => {
  let url = `${host}/gis/filter/complex/?level=${level}&wsm=${wsm}&bp=${bp}&startMonth=${startMonth}&endMonth=${endMonth}`;
  return axios.get(url);
};

export const getTyphoonCodeByComplexCondition = (
  level,
  wsm,
  bp,
  num,
  startMonth,
  endMonth,
  from,
  to
) => {
  // let url = `${host}/gis/filter/GetTyphoonCodeByComplexCondition/?level=${level}&wsm=${wsm}&bp=${bp}&startMonth=${startMonth}&endMonth=${endMonth}&from=${from}&to=${to}`
  let url = `${host}/gis/filter/typhoon/complex/?level=${level}&wsm=${wsm}&bp=${bp}&num=${num}&startMonth=${startMonth}&endMonth=${endMonth}&from=${from}&to=${to}`;
  return axios.get(url);
};

export const getTimeByCode = (code, from, to, num) => {
  let url = `${host}/gis/filter/GetTimeByCode/?code=${code}&from=${from}&to=${to}&num=${num}`;
  return axios.get(url);
};

export const getDetail = (code, date) => {
  let url = `${host}/gis/filter/GetDetail/?code=${code}&date=${date}`;
  return axios.get(url);
};

export const getAllTyphoonCode = year => {
  let url = `${host}/gis/data/GetAllTyphoonCode/?year=${year}`;
  return axios.get(url);
};

export const getAllTyphoonYear = () => {
  let url = `${host}/gis/data/GetAllTyphoonYear`;
  return axios.get(url);
};

export const getAllObsStation = (year, code) => {
  let url = `${host}/gis/data/GetAllObsStationCode/?year=${year}&code=${code}`;
  return axios.get(url);
};

export const getStationObserveData = (year, typhoonnum, code) => {
  let url = `${host}/gis/data/GetStationObserveData/?year=${year}&code=${code}&typhoonnum=${typhoonnum}`;
  return axios.get(url);
};

// 根据台风num获取该过程的最大风速
export const getRealDataMws = num => {
  let url = `${host}/gis/data/GetRealDataMws?num=${num}`;
  return axios.get(url);
};

// 根据台风编号获取台风的最低气压（之前为最大气压）
export const getRealDataMbp = num => {
  let url = `${host}/gis/data/GetRealDataMbp?num=${num}`;
  return axios.get(url);
};

//根据year和num获取灾情图片url列表
export const getDisasterPicPath = (year, num) => {
  let url = `${host}/gis/data/GetDisasterPicPath?year=${year}&num=${num}`;
  return axios.get(url);
};
//返回一个基础路径配合图片地址
export const getBaseHostPicPath = () => {
  return `${host}/gis/`;
};
