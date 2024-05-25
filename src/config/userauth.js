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


const setUserCookies = (val) => {
  const utTime = parseInt(process.env.NEXT_PUBLIC_USER_TOKEN_TIME);
   return Cookies.set('usertoken', val, { expires: utTime, secure: true });
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
 

const setLoginNumber = (val) => {
  const registerMobileTime = parseInt(process.env.NEXT_PUBLIC_REGISTATION_MOBILE_TIME);
  return Cookies.set('loginnumber',  val, { expires: new Date(new Date().getTime() + registerMobileTime), secure: true });
}
const isLoginNumber = () => {
  const isToken = !!Cookies.get('loginnumber');
  return isToken;
}
const getLoginNumber = () => {
  return Cookies.get('loginnumber');
}

export {  getUserID, getUserMobile, setUserCookies, getUserToken, isUserToken, isBearerToken, setLoginNumber, isLoginNumber, getLoginNumber };