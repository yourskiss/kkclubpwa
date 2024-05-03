"use client";
import Cookies from 'js-cookie';
import { decryptText } from "@/config/crypto";
 
const getUserID = () => {
  const isToken = !!Cookies.get('usertoken');
  const isValue = Cookies.get('usertoken');
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userID = decryptUserToken.split("|");
    return userID[0];
  }
}

const getUserMobile = () => {
  const isToken = !!Cookies.get('usertoken');
  const isValue = Cookies.get('usertoken');
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userMobile = decryptUserToken.split("|");
    return userMobile[1];
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