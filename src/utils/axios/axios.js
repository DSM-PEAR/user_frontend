import Axios from "axios";
import { useHistory } from "react-router-dom";

export const MainURL = "http://211.38.86.92:8005";
export const FileURL = "http://211.38.86.92:3001";

export function request(method, url, header, data) {
  return Axios({
    method,
    url: MainURL + url,
    headers: header,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      throw e;
    });
}

export function fileRequest(method, url, header, data) {
  return Axios({
    method,
    url: FileURL + url,
    headers: header,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error(e);
    });
}

export function useRefresh(data) {
  const history = useHistory();
  return Axios({
    method: "put",
    url: MainURL + "/auth",
    headers: {
      "X-Refresh-Token": localStorage.getItem("refresh-token"),
    },
    data: data,
  })
    .then((res) => {
      localStorage.setItem("access-token", res.data.access_token);
    })
    .catch(() => {
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      history.push("/");
    });
}
