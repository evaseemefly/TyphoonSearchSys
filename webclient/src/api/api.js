import axios from "axios";

export const host = "http://127.0.0.1:8000";

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
