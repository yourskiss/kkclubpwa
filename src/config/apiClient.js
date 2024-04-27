"use client";
import axios from 'axios';
import Cookies from 'js-cookie';
const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const bt = Cookies.get('bearertoken');
 

const apiClient = axios.create({
    baseURL: apiURL,
    headers: { 'authorization': 'Bearer '+ bt },
});
const _post = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};
const _get = (url, config = {}) => {
  return apiClient.get(url, config);
};
const _delete = (url, config = {}) => {
  return apiClient.delete(url, config);
};
const _put = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};


 

export { _get, _delete, _put, _post };