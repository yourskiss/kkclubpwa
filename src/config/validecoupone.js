"use client";
import Cookies from 'js-cookie';
const setCouponeCode = (val) => {
    return Cookies.set('couponecodecookies', val, { expires: new Date(new Date().getTime() + 900000), secure: true }); // 3600000
 }
 const isCouponeCode = () => {
   const isToken = !!Cookies.get('couponecodecookies');
   return isToken;
 }
 const getCouponeCode = () => {
   const isValue = Cookies.get('couponecodecookies');
   return isValue;
 }


 
export {  setCouponeCode, isCouponeCode, getCouponeCode };