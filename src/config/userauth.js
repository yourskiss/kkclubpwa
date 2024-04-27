"use client";
import Cookies from 'js-cookie';
import { decryptText } from "@/config/crypto";
import { _get } from "@/config/apiClient";
 
const getUserID = () => {
  const isToken = !!Cookies.get('usertoken');
  const isValue = Cookies.get('usertoken');
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userID = decryptUserToken.split("|")[0];
    return userID
  }
}

const getUserMobile = () => {
  const isToken = !!Cookies.get('usertoken');
  const isValue = Cookies.get('usertoken');
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userMobile = decryptUserToken.split("|")[1];
    return userMobile
  }
}


const setUserCookies = (name, val) => {
   return Cookies.set(name, val, { expires: new Date(new Date().getTime() + 3600000), secure: true });
}


const isUserToken = () => {
  const isToken = !!Cookies.get('usertoken');
  return isToken;
}


const getUserToken = () => {
  const isValue = Cookies.get('usertoken');
  return isValue;
}
 

const isBearerToken = () => {
  const isBT = !!Cookies.get('bearertoken');
  return isBT;
}

export {  getUserID, getUserMobile, setUserCookies, getUserToken, isUserToken, isBearerToken };